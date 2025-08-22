import { MigrationFn } from "umzug";
import { Database } from "sqlite";

export const up: MigrationFn<Database> = async ({ context: db }) => {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS checklistItem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      isChecked BOOLEAN NOT NULL,
      position INTEGER NOT NULL,
      dateModified DATETIME DEFAULT CURRENT_TIMESTAMP,
      checklistId INTEGER NOT NULL,
      FOREIGN KEY (checklistId) REFERENCES checklist(id) ON DELETE CASCADE
    );
  `);
};

export const down: MigrationFn<Database> = async ({ context: db }) => {
    await db.exec(`DROP TABLE IF EXISTS checklistItem`);
};
