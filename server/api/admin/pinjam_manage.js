import express from "express";
import db from "../../config/db.js";

const router = express.Router();

// ✅ GET semua data peminjaman dengan JOIN
router.get("/", async (req, res) => {
  try {
    console.log("📥 Request GET /api/admin/peminjamann");
    const [results] = await db.query(`
      SELECT 
        p.id_peminjaman, p.id_anggota, p.id_buku, 
        p.tanggal_pinjam, p.tanggal_kembali, p.status,
        a.nama AS nama_anggota, a.nis_nip, a.no_telp,
        u.username,
        b.judul AS judul_buku, b.kode_buku, b.penerbit, b.stok, b.cover
      FROM peminjaman p
      LEFT JOIN anggota a ON p.id_anggota = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN books b ON p.id_buku = b.id
      ORDER BY 
        CASE 
          WHEN p.status = 'Pending' THEN 1
          WHEN p.status = 'Approved' THEN 2
          WHEN p.status = 'Dipinjam' THEN 3
          WHEN p.status = 'Terlambat' THEN 4
          WHEN p.status = 'Dikembalikan' THEN 5
        END,
        p.id_peminjaman DESC
    `);

    console.log("✅ Data peminjaman berhasil diambil:", results.length, "rows");
    res.json(results);
  } catch (err) {
    console.error("❌ Error GET peminjaman:", err.message);
    res.status(500).json({ message: "Gagal mengambil data peminjaman", error: err.message });
  }
});

// ✅ GET check status terlambat otomatis (PINDAHKAN KE ATAS SEBELUM /:id)
router.get("/check/late", async (req, res) => {
  let connection;
  try {
    console.log("📥 Request GET /api/admin/peminjamann/check/late");
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Update status jadi Terlambat jika melewati tanggal kembali
    const [result] = await connection.query(`
      UPDATE peminjaman 
      SET status = 'Terlambat' 
      WHERE status = 'Dipinjam' 
      AND tanggal_kembali < CURDATE()
    `);

    console.log("✅ Status terlambat checked, updated:", result.affectedRows, "rows");
    await connection.commit();

    res.json({ 
      message: "Pengecekan status terlambat berhasil", 
      updated: result.affectedRows 
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error checking late status:", err.message);
    res.status(500).json({ message: "Gagal mengecek status terlambat", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ GET peminjaman by ID (SETELAH /check/late)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 Request GET /api/admin/peminjamann/" + id);

    const [results] = await db.query(`
      SELECT 
        p.id_peminjaman, p.id_anggota, p.id_buku, 
        p.tanggal_pinjam, p.tanggal_kembali, p.status,
        a.nama AS nama_anggota, a.nis_nip, a.no_telp,
        u.username,
        b.judul AS judul_buku, b.kode_buku, b.penerbit, b.stok, b.cover
      FROM peminjaman p
      LEFT JOIN anggota a ON p.id_anggota = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN books b ON p.id_buku = b.id
      WHERE p.id_peminjaman = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("❌ Error GET peminjaman by ID:", err.message);
    res.status(500).json({ message: "Gagal mengambil data peminjaman", error: err.message });
  }
});

// ✅ PUT update status peminjaman (Pending -> Approved -> Dipinjam)
router.put("/:id/status", async (req, res) => {
  let connection;
  try {
    console.log("📥 Request PUT /api/admin/peminjamann/" + req.params.id + "/status");
    console.log("📦 Body:", req.body);

    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    const validStatus = ['Pending', 'Approved', 'Dipinjam', 'Dikembalikan', 'Terlambat'];
    if (!validStatus.includes(status)) {
      await connection.rollback();
      return res.status(400).json({ message: "Status tidak valid" });
    }

    // Get data peminjaman dan buku
    const [peminjaman] = await connection.query(`
      SELECT p.*, b.stok 
      FROM peminjaman p 
      LEFT JOIN books b ON p.id_buku = b.id 
      WHERE p.id_peminjaman = ?
    `, [id]);

    if (peminjaman.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
    }

    const currentStatus = peminjaman[0].status;
    const idBuku = peminjaman[0].id_buku;
    const currentStok = peminjaman[0].stok;

    // Validasi workflow status
    if (currentStatus === 'Pending' && status !== 'Approved' && status !== 'Pending') {
      await connection.rollback();
      return res.status(400).json({ message: "Status Pending hanya bisa diubah ke Approved" });
    }

    if (currentStatus === 'Approved' && status !== 'Dipinjam' && status !== 'Approved') {
      await connection.rollback();
      return res.status(400).json({ message: "Status Approved hanya bisa diubah ke Dipinjam" });
    }

    // Jika status berubah dari Approved ke Dipinjam, kurangi stok
    if (currentStatus === 'Approved' && status === 'Dipinjam') {
      if (currentStok <= 0) {
        await connection.rollback();
        return res.status(400).json({ message: "Stok buku habis, tidak bisa dipinjam" });
      }

      // Kurangi stok buku
      await connection.query(`UPDATE books SET stok = stok - 1 WHERE id = ?`, [idBuku]);
      console.log("✅ Stok buku dikurangi untuk book ID:", idBuku);
    }

    // Update status peminjaman
    await connection.query(`UPDATE peminjaman SET status = ? WHERE id_peminjaman = ?`, [status, id]);
    console.log("✅ Status peminjaman updated:", id, "->", status);

    await connection.commit();

    res.json({ 
      message: `Status berhasil diubah menjadi ${status}`, 
      id_peminjaman: id, 
      new_status: status 
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error PUT status peminjaman:", err.message);
    res.status(500).json({ message: "Gagal mengubah status peminjaman", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ DELETE/REJECT peminjaman (untuk status Pending)
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    console.log("📥 Request DELETE /api/admin/peminjamann/" + req.params.id);

    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;

    // Cek status peminjaman
    const [peminjaman] = await connection.query(
      `SELECT status FROM peminjaman WHERE id_peminjaman = ?`,
      [id]
    );

    if (peminjaman.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
    }

    // Hanya bisa delete jika status masih Pending
    if (peminjaman[0].status !== 'Pending') {
      await connection.rollback();
      return res.status(400).json({ message: "Hanya peminjaman dengan status Pending yang bisa ditolak" });
    }

    // Hapus peminjaman
    await connection.query(`DELETE FROM peminjaman WHERE id_peminjaman = ?`, [id]);
    console.log("✅ Peminjaman rejected/deleted:", id);

    await connection.commit();

    res.json({ message: "Peminjaman berhasil ditolak" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error DELETE peminjaman:", err.message);
    res.status(500).json({ message: "Gagal menolak peminjaman", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ PUT proses pengembalian buku
router.put("/:id/return", async (req, res) => {
  let connection;
  try {
    console.log("📥 Request PUT /api/admin/peminjamann/" + req.params.id + "/return");
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

    // Get data peminjaman
    const [peminjaman] = await connection.query(
      `SELECT * FROM peminjaman WHERE id_peminjaman = ?`,
      [id]
    );

    if (peminjaman.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
    }

    const currentStatus = peminjaman[0].status;
    const idBuku = peminjaman[0].id_buku;

    // Validasi status harus Dipinjam atau Terlambat
    if (currentStatus !== 'Dipinjam' && currentStatus !== 'Terlambat') {
      await connection.rollback();
      return res.status(400).json({ message: "Hanya peminjaman dengan status Dipinjam atau Terlambat yang bisa dikembalikan" });
    }

    // Insert ke tabel pengembalian
    await connection.query(`
      INSERT INTO pengembalian (id_peminjaman, tanggal_dikembalikan, denda, keterangan) 
      VALUES (?, ?, ?, ?)
    `, [id, tanggal_dikembalikan, denda || 0, keterangan || null]);

    console.log("✅ Data pengembalian inserted for peminjaman ID:", id);

    // Update status peminjaman jadi Dikembalikan
    await connection.query(`UPDATE peminjaman SET status = 'Dikembalikan' WHERE id_peminjaman = ?`, [id]);
    console.log("✅ Status peminjaman updated to Dikembalikan:", id);

    // Tambah stok buku kembali
    await connection.query(`UPDATE books SET stok = stok + 1 WHERE id = ?`, [idBuku]);
    console.log("✅ Stok buku ditambah kembali untuk book ID:", idBuku);

    await connection.commit();

    res.json({ 
      message: "Buku berhasil dikembalikan", 
      id_peminjaman: id, 
      denda: denda || 0 
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error PUT return peminjaman:", err.message);
    res.status(500).json({ message: "Gagal memproses pengembalian", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export default router;