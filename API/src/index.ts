import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") }); //! Set environment variables globally avaialable
import https from "https";
import fs from "fs";
import cookieParser from "cookie-parser";
import { runMigrationsWithRetry } from "./migrate";
import checklistRoutes from "./routes/checklistRoutes";
import checklistItemRoutes from "./routes/checklistItemRoutes";
import configRoutes from "./routes/configRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import userRoutes from "./routes/userRoutes";

const app: express.Application = express();
const port: Number = Number(process.env.API_PORT);

//! Use options and server for https certificate during development
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
    try {
        await runMigrationsWithRetry(10, 5000); // 10 attempts, 5s apart
        console.log(`🚀 Server running at https://localhost:${port}/`);
    } catch (err) {
        console.error("Migration process failed:", err);
        process.exit(1); // exit container if migrations never succeed
    }

    console.log(`TypeScript with Express listening on https://localhost:${port}/`);
});
