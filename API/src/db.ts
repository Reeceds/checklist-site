import sqlite3 from "sqlite3";
import { open } from "sqlite";

//! Database connetion
// Open returns a Promise
export const connectDB = async () => {
    const db = await open({
        filename: "./checklist.db",
        driver: sqlite3.Database,
    });

    // Enable foreign key support
    await db.exec("PRAGMA foreign_keys = ON");

    return db;
};
