import express from "express";
import db from "../../config/db.js";

const router = express.Router();

// ✅ GET semua data peminjaman
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        p.id_peminjaman,
        u.username AS nama_peminjam,
        b.judul AS judul_buku,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.status
      FROM peminjaman p
      JOIN users u ON p.id_anggota = u.id
      JOIN books b ON p.id_buku = b.id
      ORDER BY p.id_peminjaman DESC
    `);
    res.json(results);
  } catch (err) {
    console.error("❌ Gagal mengambil data peminjaman:", err);
    res.status(500).json({ message: "Gagal mengambil data peminjaman" });
  }
});

// ✅ POST tambah peminjaman
router.post("/", async (req, res) => {
  try {
    const { id_anggota, id_buku, tanggal_pinjam, tanggal_kembali, status } = req.body;

    const sql = `
      INSERT INTO peminjaman (id_anggota, id_buku, tanggal_pinjam, tanggal_kembali, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [id_anggota, id_buku, tanggal_pinjam, tanggal_kembali, status]);
    res.json({ message: "Peminjaman berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("❌ Gagal menambah peminjaman:", err);
    res.status(500).json({ message: "Gagal menambah data peminjaman" });
  }
});

// ✅ PUT update status peminjaman
router.put("/:id_peminjaman", async (req, res) => {
  try {
    const { id_peminjaman } = req.params;
    const { status } = req.body;

    const sql = `UPDATE peminjaman SET status = ? WHERE id_peminjaman = ?`;
    await db.query(sql, [status, id_peminjaman]);

    res.json({ message: "Status peminjaman berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Gagal mengubah status:", err);
    res.status(500).json({ message: "Gagal mengubah status peminjaman" });
  }
});

// ✅ DELETE peminjaman
router.delete("/:id_peminjaman", async (req, res) => {
  try {
    const { id_peminjaman } = req.params;

    const sql = `DELETE FROM peminjaman WHERE id_peminjaman = ?`;
    await db.query(sql, [id_peminjaman]);

    res.json({ message: "Peminjaman berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus data peminjaman:", err);
    res.status(500).json({ message: "Gagal menghapus data peminjaman" });
  }
});

export default router;
