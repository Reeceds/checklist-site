import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const authorize = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const secret = process.env.ACCESS_TOKEN_SECRET!;
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};
