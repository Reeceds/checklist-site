import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authorize";
import { Database } from "sqlite";
import { connectDB } from "../db";

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (userId === null || userId === undefined) {
            return res.status(401).json("User not found.");
        }

        const db: Database = await connectDB();
        const currentUser = await db.get("SELECT email FROM user WHERE id = ?", userId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(currentUser);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
