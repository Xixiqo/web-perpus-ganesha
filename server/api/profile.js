// server/api/profile.js
import express from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔑 Middleware verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: "Token tidak valid atau sudah kadaluarsa",
      });
    req.user = decoded;
    console.log("JWT verified for profile:", decoded);
    next();
  });
};

// GET /api/profile
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching profile for user_id:", userId);

    const query = `
      SELECT 
        a.id,
        a.user_id,
        a.nis_nip,
        a.nama,
        a.jenis_kelamin,
        a.tanggal_lahir,
        a.member_expired AS status_membership,
        a.institute,
        a.major,
        a.angkatan,
        a.tipe_keanggotaan AS membership,
        a.no_telp AS telepon,
        a.created_at AS tanggal_bergabung,
        u.username,
        u.role
      FROM anggota a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ?
    `;

    // ❗ Gunakan promise() untuk await
    const [rows] = await db.query(query, [userId]);
    console.log("Profile rows:", rows);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Profil tidak ditemukan. Pastikan data anggota sudah lengkap.",
      });
    }

    // Kirim data yang sudah sesuai dengan field frontend
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data profil",
      error: err.message,
    });
  }
});

export default router;
