import dotenv from "dotenv";
import path from "path";
import fs from "fs";
// Load .env only when running locally (not inside Docker)
// Docker Compose injects environment variables automatically.
if (!process.env.RUNNING_IN_DOCKER) {
    const envPath = path.resolve(__dirname, "../../.env");
    dotenv.config({ path: envPath });
    console.log(`Loaded .env from ${envPath}`);
} else {
    console.log("Running inside Docker — using container environment variables");
}
import express from "express";
import cors from "cors";
import http from "http";
import https from "https";
import cookieParser from "cookie-parser";
import { runMigrationsWithRetry } from "./migrate";
import checklistRoutes from "./routes/checklistRoutes";
import checklistItemRoutes from "./routes/checklistItemRoutes";
import configRoutes from "./routes/configRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import userRoutes from "./routes/userRoutes";

const app: express.Application = express();
const port: number = Number(process.env.API_PORT) || 3000;

// HTTPS setup (only used in development)
let server;

if (process.env.NODE_ENV === "development") {
    const options = {
        key: fs.readFileSync(path.join(__dirname, "../ssl/localhost-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "../ssl/localhost.pem")),
    };
    server = https.createServer(options, app);
    console.log("Using HTTPS (development mode)");
} else {
    server = http.createServer(app);
    console.log("Using HTTP (production mode)");
}

app.use(
    cors({
        origin: ["http://localhost:4200", process.env.CLIENT_ORIGIN || ""],
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

server.listen(port, "0.0.0.0", async () => {
    try {
        await runMigrationsWithRetry(10, 5000); // 10 attempts, 5s apart
        console.log(`🚀 Server running at https://localhost:${port}/`);
    } catch (err) {
        console.error("Migration process failed:", err);
        process.exit(1); // exit container if migrations never succeed
    }

    console.log(`TypeScript with Express listening on https://localhost:${port}/`);
});
