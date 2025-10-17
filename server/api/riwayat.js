// server/api/riwayat.js
import express from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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

// POST /api/riwayat
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { id_anggota, id_buku, tanggal_pinjam, status } = req.body;

    console.log("📥 Received borrow request:", req.body);

    // Validasi input
    if (!id_anggota || !id_buku || !tanggal_pinjam) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap. id_anggota, id_buku, dan tanggal_pinjam wajib diisi."
      });
    }

    // Cek apakah anggota valid dan membership masih aktif
    const [anggotaRows] = await db.query(
      "SELECT * FROM anggota WHERE id = ? AND user_id = ?",
      [id_anggota, req.user.id]
    );

    if (!anggotaRows.length) {
      return res.status(403).json({
        success: false,
        message: "Data anggota tidak ditemukan atau tidak sesuai dengan user Anda."
      });
    }

    const anggota = anggotaRows[0];
    
    // Cek apakah membership masih aktif
    if (anggota.member_expired) {
      const today = new Date();
      const expiryDate = new Date(anggota.member_expired);
      
      if (expiryDate < today) {
        return res.status(403).json({
          success: false,
          message: "Membership Anda sudah expired. Silakan perpanjang membership terlebih dahulu."
        });
      }
    }

    // Cek apakah buku tersedia
    const [bookRows] = await db.query(
      "SELECT * FROM books WHERE id = ?",
      [id_buku]
    );

    if (!bookRows.length) {
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan."
      });
    }

    // Cek apakah user sudah punya peminjaman aktif untuk buku yang sama
    const [activeBorrowRows] = await db.query(
      `SELECT * FROM peminjaman 
       WHERE id_anggota = ? AND id_buku = ? AND status = 'Dipinjam'`,
      [id_anggota, id_buku]
    );

    if (activeBorrowRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah meminjam buku ini dan belum mengembalikannya."
      });
    }

    // Insert peminjaman baru
    const insertQuery = `
      INSERT INTO peminjaman (id_anggota, id_buku, tanggal_pinjam, status)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      id_anggota,
      id_buku,
      tanggal_pinjam,
      status || 'Dipinjam'
    ]);

    console.log("✅ Peminjaman created with ID:", result.insertId);

    res.status(201).json({
      success: true,
      message: "Peminjaman berhasil diajukan!",
      data: {
        id_peminjaman: result.insertId,
        id_anggota,
        id_buku,
        tanggal_pinjam,
        status: status || 'Dipinjam'
      }
    });

  } catch (err) {
    console.error("❌ Error creating peminjaman:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengajukan peminjaman",
      error: err.message
    });
  }
});

// 📚 GET /api/riwayat - Ambil riwayat peminjaman user
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