import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authorize";
import { pool } from "../db";
import { RowDataPacket } from "mysql2";
import { User } from "../models/user";

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(401).json("User not found.");
        }

        const [userData] = await pool.query<RowDataPacket[]>("SELECT email FROM user WHERE id = ?", [userId]);

        const currentUser = userData[0] as User;

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(currentUser);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
