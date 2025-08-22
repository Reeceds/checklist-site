import { MigrationFn } from "umzug";
import { Database } from "sqlite";

export const up: MigrationFn<Database> = async ({ context: db }) => {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS checklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      dateModified DATETIME DEFAULT CURRENT_TIMESTAMP,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );
  `);
};

export const down: MigrationFn<Database> = async ({ context: db }) => {
    await db.exec(`DROP TABLE IF EXISTS checklist`);
};
