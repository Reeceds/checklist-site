import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authorize";
import { pool } from "../db";
import { User } from "../models/user";

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const userData = await pool.query<User>("SELECT email FROM users WHERE id = $1", [userId]);

        if (userData.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(userData.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
