import { Pool } from "pg";

let pool: Pool;

if (process.env.DATABASE_URL) {
    // --- Render + Supabase ---
    pool = new Pool({
        connectionString: process.env.DATABASE_URL, // Required for Supabase (Postgress db server)
        ssl: { rejectUnauthorized: false }, // Required for Supabase (Postgress db server)
    });
} else {
    // --- Local Docker ---
    if (
        !process.env.POSTGRES_HOST ||
        !process.env.POSTGRES_USER ||
        !process.env.POSTGRES_PASSWORD ||
        !process.env.POSTGRES_DATABASE
    ) {
        throw new Error("Missing required postgres environment variables");
    }

    pool = new Pool({
        host: process.env.POSTGRES_HOST || "postgres", // Backend API Docker = "postgres", Backend API Local = "127.0.0.1"
        user: process.env.POSTGRES_USER || "root", // fallback to root user locally
        password: process.env.POSTGRES_PASSWORD || "rootpw", // fallback local password
        database: process.env.POSTGRES_DATABASE || "checklist-postgres-db", // default DB
        port: Number(process.env.POSTGRES_PORT) || 5432,
        max: 10,
    });
}

// Test connection
pool.connect()
    .then((conn) => {
        console.log("PostgreSQL connected");
        conn.release();
    })
    .catch((err) => {
        console.error("PostgreSQL connection failed:", err);
        process.exit(1);
    });

export { pool };
