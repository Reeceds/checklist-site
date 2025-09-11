import { Request, Response } from "express";
import { connectDB } from "../db";
import { Database } from "sqlite";
import { Checklist } from "../models/checklist";
import { AuthRequest } from "../middleware/authorize";
import { checklistItem } from "../models/checklistItem";

// GET all
export const getChecklists = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (userId === null || userId === undefined) {
            return res.status(401).json("User not found.");
        }

        const db: Database = await connectDB();

        const checklists: Checklist[] = await db.all(
            "SELECT * FROM checklist WHERE userId = ? ORDER BY dateModified DESC",
            userId
        );

        res.status(200).json(checklists);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// GET by ID
export const getChecklistById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (userId === null || userId === undefined) {
            return res.status(401).json("User not found.");
        }

        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const db: Database = await connectDB();
        const checklist: Checklist | undefined = await db.get(
            "SELECT * FROM checklist WHERE id = ? AND userId = ?",
            id,
            userId
        );
        const checklistItems = await db.all(
            "SELECT * FROM checklistItem WHERE checklistId = ? AND userId = ? ORDER BY position ASC;",
            id,
            userId
        );

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
        if (userId === null || userId === undefined) {
            return res.status(401).json("User not found.");
        }

        const { title } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Invalid item data. Please enter a title." });
        }

        const db: Database = await connectDB();
        const result = await db.run("INSERT INTO checklist (title, userId) VALUES (?, ?);", title, userId);

        res.status(201).json({ id: result.lastID, title });
    } catch (err) {
        res.status(500).json({ message: "Error creating item", error: err });
    }
};

// PUT update
export const updateChecklist = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (userId === null || userId === undefined) {
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

        const db: Database = await connectDB();
        const item: Checklist | undefined = await db.get(
            "SELECT * FROM checklist WHERE id = ? AND userId = ?",
            id,
            userId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const result = await db.run(
            "UPDATE checklist SET title = ?, dateModified = CURRENT_TIMESTAMP WHERE id = ?",
            title,
            id
        );

        res.status(200).json({ message: "Checklist item updated", id: result.lastID, title });
    } catch (err) {
        res.status(500).json({ message: "Error updating item", error: err });
    }
};

// DELETE
export const deleteChecklist = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (userId === null || userId === undefined) {
            return res.status(401).json("User not found.");
        }

        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const db: Database = await connectDB();
        const item: Checklist | undefined = await db.get(
            "SELECT * FROM checklist WHERE id = ? AND userId = ?",
            id,
            userId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        await db.run("DELETE FROM checklist WHERE id = ? AND userId = ?", id, userId);

        res.status(200).json({ message: "Item successfully removed", id });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item", error: err });
    }
};
