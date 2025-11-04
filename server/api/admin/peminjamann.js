import express from "express";
import connection from "../../config/db.js";
import { createNotification } from "../notification.js";

const router = express.Router();

// ENUM status yang valid
const ALLOWED_STATUS = ["Pending", "Approved", "Dipinjam", "Dikembalikan", "Terlambat"];

// GET semua peminjaman dengan detail anggota dan buku
router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.id_peminjaman,
        p.id_anggota,
        a.nama AS nama_anggota,
        p.id_buku,
        b.judul AS judul_buku,
        b.kode_buku,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.status,
        peng.tanggal_dikembalikan,
        peng.denda,
        peng.keterangan
      FROM peminjaman p
      JOIN anggota a ON p.id_anggota = a.id
      JOIN books b ON p.id_buku = b.id
      LEFT JOIN pengembalian peng ON p.id_peminjaman = peng.id_peminjaman
      ORDER BY p.tanggal_pinjam DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memuat data peminjaman." });
  }
});

// PUT update status peminjaman
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status harus diisi." });
  if (!ALLOWED_STATUS.includes(status)) return res.status(400).json({ message: "Status tidak valid." });

  try {
    // 🔹 Ambil data peminjaman + info anggota
    const [peminjamanRows] = await connection.query(
      "SELECT p.id_anggota, p.id_buku, b.judul AS judul_buku FROM peminjaman p JOIN books b ON p.id_buku = b.id WHERE p.id_peminjaman = ?",
      [id]
    );
    if (peminjamanRows.length === 0) return res.status(404).json({ message: "Peminjaman tidak ditemukan." });

    const { id_anggota, id_buku, judul_buku } = peminjamanRows[0];

    let tanggal_kembali = null;

    if (status === "Dipinjam") {
      const [rows] = await connection.query(
        "SELECT tanggal_pinjam FROM peminjaman WHERE id_peminjaman = ?",
        [id]
      );

      let tanggalPinjam = rows[0].tanggal_pinjam ? new Date(rows[0].tanggal_pinjam) : new Date();

      // Jika tanggal_pinjam sebelumnya NULL, update di DB
      if (!rows[0].tanggal_pinjam) {
        await connection.query(
          "UPDATE peminjaman SET tanggal_pinjam = ? WHERE id_peminjaman = ?",
          [tanggalPinjam.toISOString().split("T")[0], id]
        );
      }

      tanggalPinjam.setDate(tanggalPinjam.getDate() + 14);
      tanggal_kembali = tanggalPinjam.toISOString().split("T")[0];
    }

    // 🔹 Update status di database
    const query = tanggal_kembali
      ? "UPDATE peminjaman SET status = ?, tanggal_kembali = ? WHERE id_peminjaman = ?"
      : "UPDATE peminjaman SET status = ? WHERE id_peminjaman = ?";
    const params = tanggal_kembali ? [status, tanggal_kembali, id] : [status, id];
    const [result] = await connection.query(query, params);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Peminjaman tidak ditemukan." });

    // 🔹 Tentukan isi notifikasi sesuai status baru
    let tipe = "";
    let judul = "";
    let pesan = "";
    let icon = "📘";

    switch (status) {
      case "Approved":
        tipe = "peminjaman_approved";
        judul = "Peminjaman Disetujui";
        pesan = `Peminjaman buku "${judul_buku}" telah disetujui oleh pustakawan.`;
        icon = "✅";
        break;
      case "Dipinjam":
        tipe = "peminjaman_dipinjam";
        judul = "Buku Sedang Dipinjam";
        pesan = `Buku "${judul_buku}" sekarang sedang kamu pinjam.`;
        icon = "📚";
        break;
      case "Dikembalikan":
        tipe = "peminjaman_rejected"; // kalau kamu punya tipe khusus "peminjaman_dikembalikan", ganti di sini
        judul = "Buku Dikembalikan";
        pesan = `Terima kasih sudah mengembalikan buku "${judul_buku}".`;
        icon = "📗";
        break;
      case "Terlambat":
        tipe = "peminjaman_terlambat";
        judul = "Peminjaman Terlambat";
        pesan = `Peminjaman buku "${judul_buku}" sudah melewati batas waktu. Harap segera dikembalikan.`;
        icon = "⏰";
        break;
    }

    // 🔹 Kirim notifikasi ke user
    if (tipe) {
      await createNotification({
        id_anggota,
        id_peminjaman: id,
        tipe,
        judul,
        pesan,
        icon
      });
    }

    res.json({
      message: `Status berhasil diubah menjadi ${status}.`,
      tanggal_kembali
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui status peminjaman." });
  }
});


// PUT pengembalian buku
router.put("/:id/return", async (req, res) => {
  const { id } = req.params;
  const { tanggal_dikembalikan, denda, keterangan } = req.body;

  if (!tanggal_dikembalikan) return res.status(400).json({ message: "Tanggal dikembalikan harus diisi." });

  try {
    // 1️⃣ Update status di tabel peminjaman
    const [updateResult] = await connection.query(
      "UPDATE peminjaman SET status='Dikembalikan' WHERE id_peminjaman=?",
      [id]
    );
    if (updateResult.affectedRows === 0) return res.status(404).json({ message: "Peminjaman tidak ditemukan." });

    // 2️⃣ Insert atau update data pengembalian
    await connection.query(`
      INSERT INTO pengembalian (id_peminjaman, tanggal_dikembalikan, denda, keterangan)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        tanggal_dikembalikan = VALUES(tanggal_dikembalikan),
        denda = VALUES(denda),
        keterangan = VALUES(keterangan)
    `, [id, tanggal_dikembalikan, denda || 0, keterangan || ""]);

    res.json({
      message: "Buku berhasil dikembalikan",
      denda: denda || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memproses pengembalian." });
  }
});

// GET cek status terlambat
router.get("/check/late", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT id_peminjaman, tanggal_kembali FROM peminjaman WHERE status='Dipinjam'"
    );
    const today = new Date();
    let updated = 0;

    for (const row of rows) {
      const dueDate = new Date(row.tanggal_kembali);
      if (today > dueDate) {
        await connection.query("UPDATE peminjaman SET status='Terlambat' WHERE id_peminjaman=?", [row.id_peminjaman]);
        updated++;
      }
    }

    res.json({ updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengecek status terlambat." });
  }
});

export default router;
