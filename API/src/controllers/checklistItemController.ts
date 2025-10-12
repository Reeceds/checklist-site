import { Request, Response } from "express";
import { pool } from "../db";
import { checklistItem } from "../models/checklistItem";
import { AuthRequest } from "../middleware/authorize";

// POST create, update, delete
export const modifyChecklistItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;

        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const checklistId = req.params.id;
        const reqData: checklistItem[] = req.body;

        if (reqData.length) {
            const invalidData = reqData.some((e) => typeof e.content !== "string" || !e.content.trim());
            if (invalidData) return res.status(400).json({ message: "Invalid checklist content" });
        }

        const dbItemsData = await pool.query<checklistItem>(
            "SELECT * FROM checklist_item WHERE checklist_id = $1 AND user_id = $2",
            [checklistId, userId]
        );

        const dbItems: checklistItem[] = dbItemsData.rows;

        if (dbItems.length > 0) {
            // UPDATE
            const updatedItems = reqData.filter((reqItem: checklistItem) =>
                dbItems.some(
                    (dbItem: checklistItem) =>
                        dbItem.id === reqItem.id &&
                        (dbItem.content !== reqItem.content ||
                            dbItem.is_checked !== reqItem.is_checked ||
                            dbItem.position !== reqItem.position)
                )
            );

            if (updatedItems.length) {
                await Promise.all(
                    updatedItems.map((e: checklistItem) => {
                        pool.query<checklistItem>(
                            "UPDATE checklist_item SET content = $1, is_checked = $2, position = $3, date_modified = CURRENT_TIMESTAMP WHERE id = $4",
                            [e.content, e.is_checked, e.position, e.id]
                        );
                    })
                );
            }

            // DELETE
            const itemsToDelete = dbItems.filter(
                (dbItem: checklistItem) => !reqData.some((reqItem: checklistItem) => reqItem.id === dbItem.id)
            );

            await Promise.all(
                itemsToDelete.map((el: checklistItem) => {
                    if (itemsToDelete) {
                        pool.query<checklistItem>("DELETE FROM checklist_item WHERE id = $1", [el.id]);
                    }
                })
            );
        }

        // CREATE
        var newItems = reqData.filter((el) => !el.id);
        if (newItems.length) {
            await Promise.all(
                newItems.map((e: checklistItem) => {
                    return pool.query<checklistItem>(
                        "INSERT INTO checklist_item (content, checklist_id, is_checked, position, user_id) VALUES ($1, $2, $3, $4, $5)",
                        [e.content, checklistId, e.is_checked ?? false, e.position ?? 0, userId]
                    );
                })
            );
        }

        // UPDATE checklist dateModified
        await pool.query<checklistItem>(
            "UPDATE checklist SET date_modified = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2",
            [checklistId, userId]
        );

        res.status(201).json({ message: "Success" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
