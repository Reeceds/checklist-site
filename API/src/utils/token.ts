import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

// Create Access Token
export function generateAccessToken(userId: number) {
    return jwt.sign(
        { sub: userId }, // claims
        ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
    );
}

// Create Refresh Token
export function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

// Verify any token
export function verifyToken(token: string, secret: string) {
    return jwt.verify(token, secret);
}
