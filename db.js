// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 detik
});

// cek koneksi saat server start
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database connected!');
    conn.release();
  } catch (err) {
    console.error('❌ Gagal connect ke database:', err.message);
  }
})();

module.exports = pool;
