// server/api/auth.js
import express from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";

// 🟢 LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Username atau password salah" });
    }

    const user = rows[0];

    // 🔑 Buat token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    console.log(`Login success: ${user.username}`);

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

// 🟢 REGISTER
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role || "siswa"]
    );

    console.log(`User registered: ${username}, ID: ${result.insertId}`);
    res.json({ success: true, message: "Registrasi berhasil", userId: result.insertId });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Gagal register", error: err.message });
  }
});

// 🟢 Middleware verifikasi token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: "Token tidak valid" });
    req.user = decoded;
    console.log("JWT verified:", decoded);
    next();
  });
};

export default router;