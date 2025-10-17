import express from "express";
import db from "../../config/db.js";

const router = express.Router();

// ✅ GET semua data pengembalian dengan JOIN
router.get("/", async (req, res) => {
  try {
    console.log("📥 Request GET /api/admin/pengembaliann");
    
    const [results] = await db.query(`
      SELECT 
        pg.id_pengembalian,
        pg.id_peminjaman,
        pg.tanggal_dikembalikan,
        pg.denda,
        pg.keterangan,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.status,
        a.nama AS nama_anggota,
        a.nis_nip,
        a.no_telp,
        u.username,
        b.judul AS judul_buku,
        b.kode_buku,
        b.penerbit,
        DATEDIFF(pg.tanggal_dikembalikan, p.tanggal_kembali) AS hari_terlambat
      FROM pengembalian pg
      LEFT JOIN peminjaman p ON pg.id_peminjaman = p.id_peminjaman
      LEFT JOIN anggota a ON p.id_anggota = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN books b ON p.id_buku = b.id
      ORDER BY pg.id_pengembalian DESC
    `);
    
    console.log("✅ Data pengembalian berhasil diambil:", results.length, "rows");
    res.json(results);
  } catch (err) {
    console.error("❌ Error GET pengembalian:", err.message);
    res.status(500).json({ message: "Gagal mengambil data pengembalian", error: err.message });
  }
});

// ✅ GET statistik pengembalian (PINDAHKAN KE ATAS SEBELUM /peminjaman/:id dan /:id)
router.get("/stats/summary", async (req, res) => {
  try {
    console.log("📥 Request GET /api/admin/pengembaliann/stats/summary");
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) AS total_pengembalian,
        SUM(CASE WHEN denda > 0 THEN 1 ELSE 0 END) AS total_terlambat,
        SUM(denda) AS total_denda,
        AVG(denda) AS rata_rata_denda,
        MAX(denda) AS denda_tertinggi
      FROM pengembalian
    `);
    
    console.log("✅ Statistik pengembalian berhasil diambil");
    res.json(stats[0]);
  } catch (err) {
    console.error("❌ Error GET pengembalian stats:", err.message);
    res.status(500).json({ message: "Gagal mengambil statistik pengembalian", error: err.message });
  }
});

// ✅ GET pengembalian by id_peminjaman (SEBELUM /:id)
router.get("/peminjaman/:id_peminjaman", async (req, res) => {
  try {
    const { id_peminjaman } = req.params;
    console.log("📥 Request GET /api/admin/pengembaliann/peminjaman/" + id_peminjaman);
    
    const [results] = await db.query(`
      SELECT 
        pg.id_pengembalian,
        pg.id_peminjaman,
        pg.tanggal_dikembalikan,
        pg.denda,
        pg.keterangan,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.status,
        a.nama AS nama_anggota,
        a.nis_nip,
        a.no_telp,
        u.username,
        b.judul AS judul_buku,
        b.kode_buku,
        b.penerbit,
        DATEDIFF(pg.tanggal_dikembalikan, p.tanggal_kembali) AS hari_terlambat
      FROM pengembalian pg
      LEFT JOIN peminjaman p ON pg.id_peminjaman = p.id_peminjaman
      LEFT JOIN anggota a ON p.id_anggota = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN books b ON p.id_buku = b.id
      WHERE pg.id_peminjaman = ?
    `, [id_peminjaman]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Data pengembalian tidak ditemukan" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("❌ Error GET pengembalian by peminjaman ID:", err.message);
    res.status(500).json({ message: "Gagal mengambil data pengembalian", error: err.message });
  }
});

// ✅ GET pengembalian by ID (SETELAH route spesifik lainnya)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 Request GET /api/admin/pengembaliann/" + id);
    
    const [results] = await db.query(`
      SELECT 
        pg.id_pengembalian,
        pg.id_peminjaman,
        pg.tanggal_dikembalikan,
        pg.denda,
        pg.keterangan,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.status,
        a.nama AS nama_anggota,
        a.nis_nip,
        a.no_telp,
        u.username,
        b.judul AS judul_buku,
        b.kode_buku,
        b.penerbit,
        DATEDIFF(pg.tanggal_dikembalikan, p.tanggal_kembali) AS hari_terlambat
      FROM pengembalian pg
      LEFT JOIN peminjaman p ON pg.id_peminjaman = p.id_peminjaman
      LEFT JOIN anggota a ON p.id_anggota = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN books b ON p.id_buku = b.id
      WHERE pg.id_pengembalian = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Data pengembalian tidak ditemukan" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("❌ Error GET pengembalian by ID:", err.message);
    res.status(500).json({ message: "Gagal mengambil data pengembalian", error: err.message });
  }
});

// ✅ PUT update data pengembalian
router.put("/:id", async (req, res) => {
  let connection;
  
  try {
    console.log("📥 Request PUT /api/admin/pengembaliann/" + req.params.id);
    console.log("📦 Body:", req.body);
    
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const { tanggal_dikembalikan, denda, keterangan } = req.body;

    // Validasi
    if (!tanggal_dikembalikan) {
      await connection.rollback();
      return res.status(400).json({ message: "Tanggal dikembalikan wajib diisi" });
    }

    // Update pengembalian
    await connection.query(
      `UPDATE pengembalian 
       SET tanggal_dikembalikan = ?, denda = ?, keterangan = ?
       WHERE id_pengembalian = ?`,
      [tanggal_dikembalikan, denda || 0, keterangan || null, id]
    );

    console.log("✅ Pengembalian updated:", id);

    await connection.commit();
    res.json({ message: "Data pengembalian berhasil diperbarui" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error PUT pengembalian:", err.message);
    res.status(500).json({ message: "Gagal mengubah data pengembalian", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ DELETE pengembalian (HATI-HATI: akan reset status peminjaman dan stok)
router.delete("/:id", async (req, res) => {
  let connection;
  
  try {
    console.log("📥 Request DELETE /api/admin/pengembaliann/" + req.params.id);
    
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;

    // Get data pengembalian dan peminjaman
    const [pengembalian] = await connection.query(
      `SELECT pg.*, p.id_buku 
       FROM pengembalian pg
       LEFT JOIN peminjaman p ON pg.id_peminjaman = p.id_peminjaman
       WHERE pg.id_pengembalian = ?`,
      [id]
    );

    if (pengembalian.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Data pengembalian tidak ditemukan" });
    }

    const idPeminjaman = pengembalian[0].id_peminjaman;
    const idBuku = pengembalian[0].id_buku;

    // Hapus data pengembalian
    await connection.query(`DELETE FROM pengembalian WHERE id_pengembalian = ?`, [id]);
    console.log("✅ Pengembalian deleted:", id);

    // Kembalikan status peminjaman ke Dipinjam
    await connection.query(
      `UPDATE peminjaman SET status = 'Dipinjam' WHERE id_peminjaman = ?`,
      [idPeminjaman]
    );
    console.log("✅ Status peminjaman dikembalikan ke Dipinjam:", idPeminjaman);

    // Kurangi stok buku (karena buku dianggap masih dipinjam)
    await connection.query(
      `UPDATE books SET stok = stok - 1 WHERE id = ?`,
      [idBuku]
    );
    console.log("✅ Stok buku dikurangi kembali untuk book ID:", idBuku);

    await connection.commit();
    res.json({ 
      message: "Data pengembalian berhasil dihapus, status peminjaman dikembalikan ke Dipinjam" 
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error DELETE pengembalian:", err.message);
    res.status(500).json({ message: "Gagal menghapus data pengembalian", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export default router;