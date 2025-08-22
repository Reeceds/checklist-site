import { MigrationFn } from "umzug";
import { Database } from "sqlite";

export const up: MigrationFn<Database> = async ({ context: db }) => {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      dateModified DATETIME DEFAULT CURRENT_TIMESTAMP,
      refreshToken TEXT
    );
  `);
};

export const down: MigrationFn<Database> = async ({ context: db }) => {
    await db.exec(`DROP TABLE IF EXISTS user`);
};
