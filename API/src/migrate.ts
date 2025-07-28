import { Umzug, JSONStorage } from "umzug";
import { connectDB } from "./db";
import { Database } from "sqlite";

export const runMigrations = async () => {
    const db: Database = await connectDB();

    const umzug = new Umzug({
        migrations: { glob: "src/migrations/*.ts" },
        context: db,
        storage: new JSONStorage({ path: "./.migrations.json" }),
        logger: console,
    });

    await umzug.up(); // Run all pending migrations
    // await umzug.down(); // Removes last migration, undo last structural change made to the db

    console.log("Migrations complete");
};
