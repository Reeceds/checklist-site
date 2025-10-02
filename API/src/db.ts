import mysql from "mysql2/promise";

if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
    throw new Error("Missing required MySQL environment variables");
}

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "mysql", // Backend API Docker = "mysql", Backend API Local = "127.0.0.1"
    user: process.env.MYSQL_USER || "root", // fallback to root user locally
    password: process.env.MYSQL_PASSWORD || "rootpw", // fallback local password
    database: process.env.MYSQL_DATABASE || "checklist-mysql-db", // default DB
    port: Number(process.env.MYSQL_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test connection
pool.getConnection()
    .then((conn) => {
        console.log("MySQL connected");
        conn.release();
    })
    .catch((err) => {
        console.error("MySQL connection failed:", err);
        process.exit(1);
    });
