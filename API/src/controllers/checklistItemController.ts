import { Request, Response } from "express";
import { Database } from "sqlite";
import { connectDB } from "../db";
import { checklistItem } from "../models/checklistItem";
import { AuthRequest } from "../middleware/authorize";

// POST create, update, delete
export const modifyChecklistItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;

        if (userId === null || userId === undefined) {
            return res.status(401).json("User not found.");
        }

        const checklistId = req.params.id;
        const reqData: checklistItem[] = req.body;

        const invalidData = reqData.some((e) => typeof e.content !== "string" || !e.content.trim());

        if (!reqData.length || invalidData) return res.status(400).json({ message: "Invalid checklist content" });

        const db: Database = await connectDB();
        const dbItems = await db.all(
            "SELECT * FROM checklistItem WHERE checklistId = ? AND userId = ?",
            checklistId,
            userId
        );

        if (dbItems.length) {
            // UPDATE
            const updatedItems = reqData.filter((reqItem: checklistItem) =>
                dbItems.some(
                    (dbItem: checklistItem) =>
                        dbItem.id === reqItem.id &&
                        (dbItem.content !== reqItem.content ||
                            dbItem.isChecked !== reqItem.isChecked ||
                            dbItem.position !== reqItem.position)
                )
            );

            if (updatedItems.length) {
                await Promise.all(
                    updatedItems.map((e: checklistItem) => {
                        db.run(
                            "UPDATE checklistItem SET content = ?, isChecked = ?, position = ?, dateModified = CURRENT_TIMESTAMP WHERE id = ?",
                            e.content,
                            e.isChecked,
                            e.position,
                            e.id
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
                        db.run("DELETE FROM checklistItem WHERE id = ?", el.id);
                    }
                })
            );
        }

        // ADD
        var newItems = reqData.filter((el) => !el.id);
        if (newItems.length) {
            await Promise.all(
                newItems.map((e: checklistItem) => {
                    return db.run(
                        "INSERT INTO checklistItem (content, checklistId, isChecked, position, userId) VALUES (?, ?, ?, ?, ?)",
                        e.content,
                        checklistId,
                        e.isChecked ?? 0,
                        e.position ?? 0,
                        userId
                    );
                })
            );
        }

        res.status(201).json({ message: "Success" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
