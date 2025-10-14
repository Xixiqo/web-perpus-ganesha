// server/config/db.js
import mysql from "mysql2/promise"; // gunakan promise version agar async/await works
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// test koneksi
pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL pool connected!");
    conn.release();
  })
  .catch(err => console.error("❌ Database connection failed:", err.message));

export default pool;
