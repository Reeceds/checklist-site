import { Request, Response } from "express";
import { pool } from "../db";
import { Checklist } from "../models/checklist";
import { AuthRequest } from "../middleware/authorize";
import { checklistItem } from "../models/checklistItem";

// GET all
export const getChecklists = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const checklistsData = await pool.query<Checklist>(
            "SELECT * FROM checklist WHERE user_id = $1 ORDER BY date_modified DESC",
            [userId]
        );

        res.status(200).json(checklistsData.rows);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// GET by ID
export const getChecklistById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const checklistData = await pool.query<Checklist>("SELECT * FROM checklist WHERE id = $1 AND user_id = $2", [
            id,
            userId,
        ]);

        if (checklistData.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        const checklistItemData = await pool.query<checklistItem>(
            "SELECT * FROM checklist_item WHERE checklist_id = $1 AND user_id = $2 ORDER BY position ASC;",
            [id, userId]
        );

        const checklistResult: Checklist = {
            ...checklistData.rows[0],
            checklist_items: checklistItemData.rows,
        };

        res.status(200).json(checklistResult);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// POST create
export const createChecklist = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const { title } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Invalid item data. Please enter a title." });
        }

        const resultData = await pool.query<Checklist>(
            "INSERT INTO checklist (title, user_id, date_modified) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id;",
            [title, userId]
        ); //! 'RETURNING id' return the id for the insreted row, used in res.status() below

        res.status(201).json({ id: resultData.rows[0].id, title });
    } catch (err) {
        res.status(500).json({ message: "Error creating item", error: err });
    }
};

// PUT update
export const updateChecklist = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const id = Number(req.params.id);
        const { title } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid input id." });
        }

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Invalid item data. Please enter a title." });
        }

        const checklistData = await pool.query<Checklist>("SELECT * FROM checklist WHERE id = $1 AND user_id = $2", [
            id,
            userId,
        ]);

        if (checklistData.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        const resultData = await pool.query<Checklist>(
            "UPDATE checklist SET title = $1, date_modified = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id",
            [title, id]
        );

        res.status(200).json({ message: "Checklist item updated", id: resultData.rows[0].id, title });
    } catch (err) {
        res.status(500).json({ message: "Error updating item", error: err });
    }
};

// DELETE
export const deleteChecklist = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const checklistItem = await pool.query<Checklist>("SELECT * FROM checklist WHERE id = $1 AND user_id = $2", [
            id,
            userId,
        ]);

        if (checklistItem.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        await pool.query<Checklist>("DELETE FROM checklist WHERE id = $1 AND user_id = $2", [id, userId]);

        res.status(200).json({
            message: "Item successfully removed",
            id: checklistItem.rows[0].id,
            title: checklistItem.rows[0].title,
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item", error: err });
    }
};
