import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize";

// Create a Sequelize connection just for migrations
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD as string,
    {
        port: Number(process.env.MYSQL_PORT) || 3306,
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
        logging: false,
    }
);

export const migrator = new Umzug({
    migrations: { glob: "src/migrations/*.ts" },
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
