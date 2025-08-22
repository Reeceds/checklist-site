import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { Database } from "sqlite";
import { connectDB } from "../db";
import { User } from "../models/user";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid token payload" });
        }

        // Fetch/create user in DB (SQL)
        const db: Database = await connectDB();
        let user: User | undefined = await db.get("SELECT * FROM user WHERE email = ?", payload.email);

        if (!user) {
            const result = await db.run(
                "INSERT INTO user (email, dateModified) values (?, CURRENT_TIMESTAMP)",
                payload.email
            );
            user = { id: result.lastID!, email: payload.email };
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();

        // Save refresh token in DB (optional)
        await db.run("UPDATE user SET refreshToken = ? WHERE id = ?", refreshToken, user.id);

        // Set refresh token as HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", //! Change this for production
            maxAge: 7 * 24 * 60 * 60 * 1000, // Calculates the amount of milliseconds in 7 days
        });

        return res.status(200).json({
            accessToken,
            isAuthSuccessful: true,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Google login failed" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        var currentToken = req.cookies.refreshToken;

        if (currentToken === null) {
            return res.status(400).json({ message: "Refresh token does not exist" });
        }

        const db: Database = await connectDB();
        const currentUser = await db.get("SELECT * FROM user WHERE refreshToken = ?", currentToken);

        if (currentUser === null) {
            return res.status(400).json({ message: "User does not exist with this token" });
        }

        const newAccessToken = generateAccessToken(currentUser.id);
        const newRefreshToken = generateRefreshToken();

        await db.run("UPDATE user SET refreshToken = ? WHERE id = ?", newRefreshToken, currentUser.id);

        // Set refresh token as HttpOnly cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", //! Change this for production
            maxAge: 7 * 24 * 60 * 60 * 1000, // Calculates the amount of milliseconds in 7 days
        });

        res.status(200).json({ message: "Refresh token renewed", accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Renew refresh token failed" });
    }
};

export const logout = async (_req: Request, res: Response) => {
    try {
        // .clearCookie() is an express method which sets the cookie expiration to a time way in the past
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true, // use false only for local dev without HTTPS
            sameSite: "none", //! Change this for production
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Logout failed" });
    }
};
