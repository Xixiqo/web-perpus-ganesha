import express from "express";
import db from "../../config/db.js";

const router = express.Router();

/* =====================================================
   📘 1️⃣ GET semua data peminjaman (dengan JOIN lengkap)
   ===================================================== */
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

    console.log(`✅ Data peminjaman berhasil diambil (${results.length} rows)`);
    res.json(results);
  } catch (err) {
    console.error("❌ Error GET peminjaman:", err);
    res.status(500).json({ message: "Gagal mengambil data peminjaman", error: err.message });
  }
});

/* =====================================================
   ⏰ 2️⃣ Cek otomatis keterlambatan peminjaman
   ===================================================== */
router.get("/check/late", async (req, res) => {
  let connection;
  try {
    console.log("📥 Request GET /api/admin/peminjamann/check/late");

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Update semua status "Dipinjam" yang sudah melewati tanggal_kembali
    const [result] = await connection.query(`
      UPDATE peminjaman 
      SET status = 'Terlambat' 
      WHERE status = 'Dipinjam' 
      AND tanggal_kembali < CURDATE();
    `);

    await connection.commit();
    console.log(`✅ Status terlambat diperbarui: ${result.affectedRows} baris`);

    res.json({
      message: "Pengecekan status keterlambatan selesai",
      updated: result.affectedRows,
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error checking late status:", err);
    res.status(500).json({ message: "Gagal mengecek status keterlambatan", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

/* =====================================================
   📗 3️⃣ GET detail peminjaman berdasarkan ID
   ===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 Request GET /api/admin/peminjamann/${id}`);

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

    if (results.length === 0)
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });

    res.json(results[0]);
  } catch (err) {
    console.error("❌ Error GET peminjaman by ID:", err);
    res.status(500).json({ message: "Gagal mengambil data peminjaman", error: err.message });
  }
});

/* =====================================================
   🔁 4️⃣ Ubah status peminjaman (Pending → Approved → Dipinjam)
   ===================================================== */
router.put("/:id/status", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`📥 PUT /api/admin/peminjamann/${id}/status`);
    console.log("📦 Body:", req.body);

    connection = await db.getConnection();
    await connection.beginTransaction();

    const validStatus = ["Pending", "Approved", "Dipinjam", "Dikembalikan", "Terlambat"];
    if (!validStatus.includes(status)) {
      await connection.rollback();
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const [peminjaman] = await connection.query(`
      SELECT p.*, b.stok 
      FROM peminjaman p 
      LEFT JOIN books b ON p.id_buku = b.id 
      WHERE p.id_peminjaman = ?;
    `, [id]);

    if (peminjaman.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
    }

    const { status: currentStatus, id_buku: idBuku, stok: currentStok } = peminjaman[0];

    if (currentStatus === "Pending" && status === "Dipinjam") {
      await connection.rollback();
      return res.status(400).json({ message: "Harus disetujui (Approved) terlebih dahulu" });
    }

    if (currentStatus === "Approved" && status === "Dipinjam") {
      if (currentStok <= 0) {
        await connection.rollback();
        return res.status(400).json({ message: "Stok buku habis" });
      }
      await connection.query(`UPDATE books SET stok = stok - 1 WHERE id = ?`, [idBuku]);
      console.log(`✅ Stok buku dikurangi (Book ID: ${idBuku})`);
    }

    await connection.query(`UPDATE peminjaman SET status = ? WHERE id_peminjaman = ?`, [status, id]);
    console.log(`✅ Status peminjaman updated: ${id} → ${status}`);

    await connection.commit();

    res.json({ message: `Status diubah ke ${status}`, id_peminjaman: id, new_status: status });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error PUT status peminjaman:", err);
    res.status(500).json({ message: "Gagal mengubah status peminjaman", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

/* =====================================================
   ❌ 5️⃣ Hapus / Tolak peminjaman (hanya jika Pending)
   ===================================================== */
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    console.log(`📥 DELETE /api/admin/peminjamann/${id}`);

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query(`SELECT status FROM peminjaman WHERE id_peminjaman = ?`, [id]);
    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    if (rows[0].status !== "Pending") {
      await connection.rollback();
      return res.status(400).json({ message: "Hanya data Pending yang bisa dihapus" });
    }

    await connection.query(`DELETE FROM peminjaman WHERE id_peminjaman = ?`, [id]);
    await connection.commit();

    console.log("✅ Peminjaman ditolak dan dihapus:", id);
    res.json({ message: "Peminjaman berhasil ditolak" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error DELETE peminjaman:", err);
    res.status(500).json({ message: "Gagal menolak peminjaman", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

/* =====================================================
   🔄 6️⃣ Proses Pengembalian Buku
   ===================================================== */
router.put("/:id/return", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { tanggal_dikembalikan, denda, keterangan } = req.body;

    console.log(`📥 PUT /api/admin/peminjamann/${id}/return`);
    console.log("📦 Body:", req.body);

    if (!tanggal_dikembalikan) {
      return res.status(400).json({ message: "Tanggal dikembalikan wajib diisi" });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [peminjaman] = await connection.query(`SELECT * FROM peminjaman WHERE id_peminjaman = ?`, [id]);
    if (peminjaman.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
    }

    const { status, id_buku } = peminjaman[0];
    if (!["Dipinjam", "Terlambat"].includes(status)) {
      await connection.rollback();
      return res.status(400).json({ message: "Hanya status Dipinjam/Terlambat yang bisa dikembalikan" });
    }

    await connection.query(`
      INSERT INTO pengembalian (id_peminjaman, tanggal_dikembalikan, denda, keterangan) 
      VALUES (?, ?, ?, ?)
    `, [id, tanggal_dikembalikan, denda || 0, keterangan || null]);

    await connection.query(`UPDATE peminjaman SET status = 'Dikembalikan' WHERE id_peminjaman = ?`, [id]);
    await connection.query(`UPDATE books SET stok = stok + 1 WHERE id = ?`, [id_buku]);

    await connection.commit();

    console.log(`✅ Buku dikembalikan (${id}), stok buku ditambah kembali`);
    res.json({ message: "Buku berhasil dikembalikan", id_peminjaman: id, denda: denda || 0 });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error PUT return peminjaman:", err);
    res.status(500).json({ message: "Gagal memproses pengembalian", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export default router;