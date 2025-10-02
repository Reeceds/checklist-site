import { Request, Response } from "express";
import { pool } from "../db";
import { Checklist } from "../models/checklist";
import { AuthRequest } from "../middleware/authorize";
import { checklistItem } from "../models/checklistItem";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// GET all
export const getChecklists = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const [checklistsData] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM checklist WHERE userId = ? ORDER BY dateModified DESC",
            [userId]
        );

        const checklists = checklistsData as Checklist[];

        res.status(200).json(checklists);
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

        const [checklistData] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM checklist WHERE id = ? AND userId = ?",
            [id, userId]
        );

        const checklist = checklistData[0] as Checklist;

        const [checklistItemData] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM checklistItem WHERE checklistId = ? AND userId = ? ORDER BY position ASC;",
            [id, userId]
        );

        const checklistItems = checklistItemData as checklistItem[];

        if (!checklist) {
            return res.status(404).json({ message: "Item not found" });
        }

        const checklistResult: Checklist = {
            ...checklist,
            checklistItems: checklistItems,
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

        const [resultData] = await pool.execute<ResultSetHeader>(
            "INSERT INTO checklist (title, userId) VALUES (?, ?);",
            [title, userId]
        );

        res.status(201).json({ id: resultData.insertId, title });
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

        const [checklistData] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM checklist WHERE id = ? AND userId = ?",
            [id, userId]
        );

        const checklist = checklistData[0] as Checklist;

        if (!checklist) {
            return res.status(404).json({ message: "Item not found" });
        }

        const [resultData] = await pool.execute<ResultSetHeader>(
            "UPDATE checklist SET title = ?, dateModified = CURRENT_TIMESTAMP WHERE id = ?",
            [title, id]
        );

        res.status(200).json({ message: "Checklist item updated", id: resultData.insertId, title });
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

        const [checklistItem] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM checklist WHERE id = ? AND userId = ?",
            [id, userId]
        );

        const checklist = checklistItem[0] as Checklist;

        if (!checklist) {
            return res.status(404).json({ message: "Item not found" });
        }

        await pool.execute<ResultSetHeader>("DELETE FROM checklist WHERE id = ? AND userId = ?", [id, userId]);

        res.status(200).json({ message: "Item successfully removed", id });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item", error: err });
    }
};
