import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // ! Set environment variables globally avaialable
import https from "https";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { runMigrations } from "./migrate";
import checklistRoutes from "./routes/checklistRoutes";
import checklistItemRoutes from "./routes/checklistItemRoutes";
import configRoutes from "./routes/configRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import userRoutes from "./routes/userRoutes";

const app: express.Application = express();
const port: number = 3000;

// ! Use options and server for https certificate during development
const options = {
    key: fs.readFileSync(path.join(__dirname, "../ssl/localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../ssl/localhost.pem")),
};
const server = https.createServer(options, app);

app.use(
    cors({
        origin: "http://localhost:4200",
        credentials: true, // Allow cookies and credentials
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/config", configRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/checklistItem", checklistItemRoutes);
app.use("/api/authentication", authenticationRoutes);
app.use("/api/current-user", userRoutes);

server.listen(port, async () => {
    await runMigrations().catch((err) => {
        console.error("Migration failed:", err);
    }); // Run pending migrations on startup

    console.log(`TypeScript with Express listening on https://localhost:${port}/`);
});
