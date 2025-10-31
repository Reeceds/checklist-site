import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { pool } from "../db";
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

        // Query user
        const userData = await pool.query<User>("SELECT * FROM users WHERE email = $1", [payload.email]);

        let user: User | undefined = userData.rows.length > 0 ? (userData.rows[0] as User) : undefined;

        // Create user if not exists
        if (!user) {
            const result = await pool.query<User>(
                "INSERT INTO users (email, date_modified) VALUES ($1, CURRENT_TIMESTAMP)",
                [payload.email]
            );
            user = { id: result.rows[0].id, email: payload.email };
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();

        // Save refresh token
        await pool.query<User>("UPDATE users SET refresh_token = $1 WHERE id = $2", [refreshToken, user.id]);

        // Set refresh token as HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", // ⚠️ adjust for production
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken, isAuthSuccessful: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Google login failed" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const currentToken = req.cookies.refreshToken;

        if (!currentToken) {
            return res.status(400).json({ message: "Refresh token does not exist" });
        }

        // Fetch user by refresh token
        const userData = await pool.query<User>("SELECT * FROM users WHERE refresh_token = $1", [currentToken]);

        if (userData.rows.length === 0) {
            return res.status(400).json({ message: "User does not exist with this token" });
        }

        const user: User = userData.rows[0];

        // Generate new tokens
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken();

        // Save new refresh token
        await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [newRefreshToken, user.id]);

        // Set refresh token as HttpOnly cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true, // ⚠️ Set to true only if HTTPS
            sameSite: "none", //! Set as 'none' for prod
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Refresh token renewed",
            accessToken: newAccessToken,
        });
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
            sameSite: "none", //! Set as 'none' for prod
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Logout failed" });
    }
};
