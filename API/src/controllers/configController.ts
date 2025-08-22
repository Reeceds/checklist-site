import { Request, Response } from "express";

export const getGoogleClientId = async (_req: Request, res: Response) => {
    try {
        res.status(200).json({ clientId: process.env.GOOGLE_CLIENT_ID });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};
