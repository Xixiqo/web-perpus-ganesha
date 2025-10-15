// server/api/profile.js
import express from "express";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔑 Middleware verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: "Token tidak valid atau sudah kadaluarsa",
      });
    req.user = decoded;
    console.log("JWT verified for profile:", decoded);
    next();
  });
};

// GET /api/profile - Mengambil data profil user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching profile for user_id:", userId);

    const query = `
      SELECT 
        a.id,
        a.user_id,
        a.nis_nip,
        a.nama,
        a.jenis_kelamin,
        a.tanggal_lahir,
        a.member_expired,
        a.institute,
        a.major,
        a.angkatan,
        a.tipe_keanggotaan,
        a.no_telp,
        a.created_at,
        a.updated_at,
        u.username,
        u.role
      FROM anggota a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ?
    `;

    const [rows] = await db.query(query, [userId]);
    console.log("Profile rows:", rows);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Profil tidak ditemukan. Pastikan data anggota sudah lengkap.",
      });
    }

    // Format tanggal lahir ke format YYYY-MM-DD untuk input date
    const profileData = rows[0];
    if (profileData.tanggal_lahir) {
      const date = new Date(profileData.tanggal_lahir);
      profileData.tanggal_lahir = date.toISOString().split('T')[0];
    }

    res.json(profileData);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data profil",
      error: err.message,
    });
  }
});

// PUT /api/profile - Update data profil
router.put("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      nis_nip,
      nama,
      jenis_kelamin,
      tanggal_lahir,
      institute,
      major,
      angkatan,
      no_telp
    } = req.body;

    console.log("Updating profile for user_id:", userId);
    console.log("Update data:", req.body);

    // Validasi input
    if (!nama || !nis_nip) {
      return res.status(400).json({
        success: false,
        message: "Nama dan NIS/NIP wajib diisi"
      });
    }

    // Validasi jenis kelamin
    if (jenis_kelamin && !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
      return res.status(400).json({
        success: false,
        message: "Jenis kelamin tidak valid"
      });
    }

    // Format tanggal lahir jika ada
    let formattedDate = null;
    if (tanggal_lahir) {
      const date = new Date(tanggal_lahir);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      }
    }

    const updateQuery = `
      UPDATE anggota 
      SET 
        nis_nip = ?,
        nama = ?,
        jenis_kelamin = ?,
        tanggal_lahir = ?,
        institute = ?,
        major = ?,
        angkatan = ?,
        no_telp = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;

    const [result] = await db.query(updateQuery, [
      nis_nip,
      nama,
      jenis_kelamin || null,
      formattedDate,
      institute || null,
      major || null,
      angkatan || null,
      no_telp || null,
      userId
    ]);

    console.log("Update result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Profil tidak ditemukan"
      });
    }

    // Ambil data terbaru setelah update
    const [updatedProfile] = await db.query(`
      SELECT 
        a.id,
        a.user_id,
        a.nis_nip,
        a.nama,
        a.jenis_kelamin,
        a.tanggal_lahir,
        a.member_expired,
        a.institute,
        a.major,
        a.angkatan,
        a.tipe_keanggotaan,
        a.no_telp,
        a.created_at,
        a.updated_at,
        u.username,
        u.role
      FROM anggota a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ?
    `, [userId]);

    // Format tanggal lahir
    if (updatedProfile[0].tanggal_lahir) {
      const date = new Date(updatedProfile[0].tanggal_lahir);
      updatedProfile[0].tanggal_lahir = date.toISOString().split('T')[0];
    }

    res.json({
      success: true,
      message: "Profil berhasil diperbarui",
      data: updatedProfile[0]
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui profil",
      error: err.message,
    });
  }
});

// POST /api/profile/change-password - Ubah password
router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    console.log("Changing password for user_id:", userId);

    // Validasi input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password lama dan password baru wajib diisi"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password baru minimal 6 karakter"
      });
    }

    // Ambil password lama dari database
    const [users] = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    const user = users[0];
    let isPasswordValid = false;

    // Deteksi apakah password sudah di-hash atau masih plain text
    // Password bcrypt selalu dimulai dengan $2a$, $2b$, atau $2y$
    const isBcryptHash = /^\$2[aby]\$/.test(user.password);

    if (isBcryptHash) {
      // Jika sudah di-hash, gunakan bcrypt.compare
      console.log("Password is hashed, using bcrypt.compare");
      try {
        isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      } catch (error) {
        console.error("Bcrypt compare error:", error);
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat memverifikasi password"
        });
      }
    } else {
      // Jika masih plain text, bandingkan langsung
      console.log("Password is plain text, using direct comparison");
      isPasswordValid = oldPassword === user.password;
    }

    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password lama tidak sesuai"
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("New password hashed successfully");

    // Update password
    const [result] = await db.query(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengubah password"
      });
    }

    console.log("Password updated successfully");

    res.json({
      success: true,
      message: "Password berhasil diubah"
    });

  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengubah password",
      error: err.message,
    });
  }
});

export default router;