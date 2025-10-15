// server/api/peminjaman.js
import express from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔒 Middleware verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Token tidak valid atau sudah kadaluarsa" });
    req.user = decoded;
    console.log("JWT verified for peminjaman:", decoded);
    next();
  });
};

// 📚 GET /api/peminjaman
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching borrowed books for user_id:", userId);

    const query = `
      SELECT 
        p.id_peminjaman,
        b.id AS book_id,
        b.judul AS title,
        b.pembuat AS author,
        b.isbn_issn AS isbn,
        b.penerbit AS publisher,
        b.cover AS cover_image,
        p.status,
        p.tanggal_pinjam AS borrow_date,
        p.tanggal_kembali AS return_date
      FROM peminjaman p
      INNER JOIN books b ON p.id_buku = b.id
      INNER JOIN anggota a ON p.id_anggota = a.id
      WHERE a.user_id = ?
      ORDER BY p.tanggal_pinjam DESC
    `;

    const [rows] = await db.query(query, [userId]);
    console.log("Peminjaman rows:", rows);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Belum ada data peminjaman untuk pengguna ini.",
      });
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching peminjaman:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data peminjaman",
      error: err.message,
    });
  }
});

export default router;
