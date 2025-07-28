import express from "express";
import cors from "cors";
import checklistRoutes from "./routes/checklistRoutes";
import { runMigrations } from "./migrate";
import checklistItemRoutes from "./routes/checklistItemRoutes";

const app: express.Application = express();

const port: number = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/checklist", checklistRoutes);
app.use("/api/checklistItem", checklistItemRoutes);

app.listen(port, async () => {
    await runMigrations().catch((err) => {
        console.error("Migration failed:", err);
    }); // Run pending migrations on startup

    console.log(`TypeScript with Express listening on http://localhost:${port}/`);
});
