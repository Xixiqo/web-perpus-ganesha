import express from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware autentikasi JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ success: false, message: "Token tidak valid atau kadaluarsa" });
    req.user = decoded; // akan ada req.user.id
    next();
  });
};

// GET /api/riwayat
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Ambil user login dari token

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
        p.tanggal_kembali AS return_date,
        k.tanggal_dikembalikan AS actual_return_date,
        k.denda,
        k.keterangan
      FROM peminjaman p
      INNER JOIN books b ON p.id_buku = b.id
      LEFT JOIN pengembalian k ON p.id_peminjaman = k.id_peminjaman
      INNER JOIN anggota a ON p.id_anggota = a.id
      INNER JOIN users u ON a.user_id = u.id
      WHERE u.id = ?
      ORDER BY p.tanggal_pinjam DESC
    `;

    const [rows] = await db.query(query, [userId]);

    res.json({
      success: true,
      data: rows.map((row) => ({
        id_peminjaman: row.id_peminjaman,
        book: {
          id: row.book_id,
          title: row.title,
          author: row.author,
          isbn: row.isbn,
          publisher: row.publisher,
          cover: row.cover_image,
        },
        status: row.status,
        borrow_date: row.borrow_date,
        return_date: row.return_date,
        actual_return_date: row.actual_return_date,
        denda: row.denda || 0,
        keterangan: row.keterangan,
      })),
    });
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
