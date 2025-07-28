import { Request, Response } from "express";
import { connectDB } from "../db";
import { Database } from "sqlite";
import { Checklist } from "../models/checklist";

// GET all
export const getChecklists = async (_req: Request, res: Response) => {
    try {
        const db: Database = await connectDB();
        const checklists: Checklist[] = await db.all("SELECT * FROM checklist");

        res.status(200).json(checklists);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// GET by ID
export const getChecklistById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const db: Database = await connectDB();
        const checklist: Checklist | undefined = await db.get("SELECT * FROM checklist WHERE id = ?", id);
        const checklistItems = await db.all("SELECT * FROM checklistItem WHERE checklistId = ?", id);

        if (!checklist) {
            return res.status(404).json({ message: "Item not found" });
        }

        const checklistResult = {
            ...checklist,
            checklistItems: checklistItems,
        };

        res.status(200).json(checklistResult);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// POST create
export const createChecklist = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Invalid item data" });
        }

        const db: Database = await connectDB();
        const result = await db.run("INSERT INTO checklist (title) VALUES (?)", title);

        res.status(201).json({ id: result.lastID, title });
    } catch (err) {
        res.status(500).json({ message: "Error creating item", error: err });
    }
};

// PUT update
export const updateChecklist = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title } = req.body;

        if (isNaN(id) || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const db: Database = await connectDB();
        const item: Checklist | undefined = await db.get("SELECT * FROM checklist WHERE id = ?", id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const result = await db.run(
            "UPDATE checklist SET title = ?, date_modified = CURRENT_TIMESTAMP WHERE id = ?",
            title,
            id
        );

        res.status(200).json({ message: "Checklist item updated", id: result.lastID, title });
    } catch (err) {
        res.status(500).json({ message: "Error updating item", error: err });
    }
};

// DELETE
export const deleteChecklist = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const db: Database = await connectDB();
        const item: Checklist | undefined = await db.get("SELECT * FROM checklist WHERE id = ?", id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        await db.run("DELETE FROM checklist WHERE id = ?", id);

        res.status(200).json({ message: "Item successfully removed", id });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item", error: err });
    }
};
