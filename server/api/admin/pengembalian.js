import express from "express";
import db from "../../config/db.js";

const router = express.Router();

/**
 * GET /api/admin/pengembalian
 * Menampilkan data pengembalian beserta info peminjam dan buku.
 */
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        g.id_pengembalian,
        u.username AS nama_peminjam,
        b.judul AS judul_buku,
        g.tanggal_dikembalikan,
        g.denda,
        g.keterangan
      FROM pengembalian g
      LEFT JOIN peminjaman p ON g.id_peminjaman = p.id_peminjaman
      LEFT JOIN users u ON p.id_anggota = u.id
      LEFT JOIN books b ON p.id_buku = b.id
      ORDER BY g.tanggal_dikembalikan DESC;
    `;

    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("❌ Gagal mengambil data pengembalian:", err);
    res.status(500).json({ message: "Gagal mengambil data pengembalian" });
  }
});

/**
 * GET /api/admin/pengembalian/total
 * Mengambil total jumlah pengembalian dan total denda keseluruhan.
 */
router.get("/total", async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) AS total_pengembalian,
        COALESCE(SUM(denda), 0) AS total_denda
      FROM pengembalian;
    `;

    const [results] = await db.query(query);
    res.json(results[0]);
  } catch (err) {
    console.error("❌ Gagal mengambil total pengembalian:", err);
    res.status(500).json({ message: "Gagal mengambil total pengembalian" });
  }
});

export default router;
