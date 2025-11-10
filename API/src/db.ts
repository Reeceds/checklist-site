import { Pool } from "pg";

if (
    !process.env.POSTGRES_HOST ||
    !process.env.POSTGRES_USER ||
    !process.env.POSTGRES_PASSWORD ||
    !process.env.POSTGRES_DATABASE
) {
    throw new Error("Missing required postgres environment variables");
}

export const pool = new Pool({
    host: process.env.POSTGRES_HOST || "postgres", // Backend API Docker = "postgres", Backend API Local = "127.0.0.1"
    user: process.env.POSTGRES_USER || "root", // fallback to root user locally
    password: process.env.POSTGRES_PASSWORD || "rootpw", // fallback local password
    database: process.env.POSTGRES_DATABASE || "checklist-postgres-db", // default DB
    port: Number(process.env.POSTGRES_PORT) || 5432,
    max: 10,
    connectionString: process.env.DATABASE_URL || "postgresql://root:rootpw@127.0.0.1:5432/checklist-postgres-db", // Required for Supabase (Postgress db server)
    ssl: { rejectUnauthorized: false }, // Required for Supabase (Postgress db server)
});

// Test connection
pool.connect()
    .then((conn) => {
        console.log("PostgresSQL connected");
        conn.release();
    })
    .catch((err) => {
        console.error("PostgresSQL connection failed:", err);
        process.exit(1);
    });
