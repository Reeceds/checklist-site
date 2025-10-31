import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize";
import path from "path";

// Create a Sequelize connection just for migrations
const sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE as string,
    process.env.POSTGRES_USER as string,
    process.env.POSTGRES_PASSWORD as string,
    {
        port: Number(process.env.POSTGRES_PORT) || 5432,
        host: process.env.POSTGRES_HOST,
        dialect: "postgres",
        logging: false,
    }
);

// Detect runtime mode: .ts when running locally, .js dist file when running in Docker
const isTs = path.extname(__filename) === ".ts";
const migrationsGlob = isTs ? "src/migrations/*.ts" : "dist/migrations/*.js";

export const migrator = new Umzug({
    migrations: { glob: migrationsGlob },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runMigrationsWithRetry(retries = 10, delay = 5000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await sequelize.authenticate();
            console.log("✅ Database connection established");
            await migrator.up();
            console.log("✅ Migrations complete");
            return;
        } catch (err) {
            console.error(`❌ Migration attempt ${attempt} failed:`, (err as Error).message);
            if (attempt < retries) {
                console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
                await wait(delay);
            } else {
                throw new Error("❌ Could not run migrations after multiple attempts");
            }
        }
    }
}
