// server/api/user.js
import express from "express";
import db from "../config/db.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// GET PROFILE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.execute(
      `SELECT u.id, u.username, u.role, a.nama, a.jenis_kelamin, a.tanggal_lahir, a.no_telp,
              a.institute, a.major, a.angkatan, a.tipe_keanggotaan, a.created_at
       FROM users u
       LEFT JOIN anggota a ON u.id = a.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Profil tidak ditemukan" });
    }

    const row = rows[0];

    // Map data sesuai properti frontend
    const profile = {
      id: row.id,
      username: row.username,
      nama: row.nama,
      jenis_kelamin: row.jenis_kelamin,
      tanggal_lahir: row.tanggal_lahir,
      telepon: row.no_telp,
      institute: row.institute,
      major: row.major,
      angkatan: row.angkatan,
      tipe_keanggotaan: row.tipe_keanggotaan,
      tanggal_bergabung: row.created_at,
      membership: row.tipe_keanggotaan, // bisa disesuaikan
      status_membership: row.member_expired ? (new Date() > new Date(row.member_expired) ? "Tidak Aktif" : "Aktif") : "Belum Terdaftar",
      email: "-", // sementara kosong
      alamat: "-", // sementara kosong
      avatar: null
    };

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal memuat profil" });
  }
});

export default router;
