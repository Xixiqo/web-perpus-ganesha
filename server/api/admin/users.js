import express from "express";
import db from "../../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ✅ GET semua data users dengan anggota (JOIN)
router.get("/", async (req, res) => {
  try {
    console.log("📥 Request GET /api/admin/users");
    
    const [results] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.role,
        u.created_at,
        a.id AS anggota_id,
        a.nis_nip,
        a.nama,
        a.jenis_kelamin,
        a.tanggal_lahir,
        a.member_expired,
        a.institute,
        a.major,
        a.angkatan,
        a.tipe_keanggotaan,
        a.no_telp
      FROM users u
      LEFT JOIN anggota a ON u.id = a.user_id
      ORDER BY u.id DESC
    `);
    
    console.log("✅ Data berhasil diambil:", results.length, "rows");
    res.json(results);
  } catch (err) {
    console.error("❌ Error GET users:", err.message);
    res.status(500).json({ message: "Gagal mengambil data users", error: err.message });
  }
});

// ✅ GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 Request GET /api/admin/users/" + id);
    
    const [results] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.role,
        u.created_at,
        a.id AS anggota_id,
        a.nis_nip,
        a.nama,
        a.jenis_kelamin,
        a.tanggal_lahir,
        a.member_expired,
        a.institute,
        a.major,
        a.angkatan,
        a.tipe_keanggotaan,
        a.no_telp
      FROM users u
      LEFT JOIN anggota a ON u.id = a.user_id
      WHERE u.id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("❌ Error GET user by ID:", err.message);
    res.status(500).json({ message: "Gagal mengambil data user", error: err.message });
  }
});

// ✅ POST tambah user baru + anggota
router.post("/", async (req, res) => {
  let connection;
  
  try {
    console.log("📥 Request POST /api/admin/users");
    console.log("📦 Body:", req.body);
    
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { 
      username, 
      password, 
      role,
      nis_nip,
      nama,
      jenis_kelamin,
      tanggal_lahir,
      member_expired,
      institute,
      major,
      angkatan,
      tipe_keanggotaan,
      no_telp
    } = req.body;

    // Validasi
    if (!username || !password) {
      await connection.rollback();
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await connection.query(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, hashedPassword, role || 'siswa']
    );

    const userId = userResult.insertId;
    console.log("✅ User created with ID:", userId);

    // Insert anggota (jika ada data anggota)
    if (nama) {
      await connection.query(
        `INSERT INTO anggota (
          user_id, nis_nip, nama, jenis_kelamin, tanggal_lahir, 
          member_expired, institute, major, angkatan, tipe_keanggotaan, no_telp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, nis_nip || null, nama, jenis_kelamin || null, tanggal_lahir || null,
          member_expired || null, institute || null, major || null, angkatan || null, 
          tipe_keanggotaan || null, no_telp || null
        ]
      );
      console.log("✅ Anggota created for user ID:", userId);
    }

    await connection.commit();
    res.json({ 
      message: "User dan anggota berhasil ditambahkan", 
      userId 
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error POST user:", err.message);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }
    
    res.status(500).json({ message: "Gagal menambah data user", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ PUT update user + anggota
router.put("/:id", async (req, res) => {
  let connection;
  
  try {
    console.log("📥 Request PUT /api/admin/users/" + req.params.id);
    console.log("📦 Body:", req.body);
    
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const { 
      username, 
      password, 
      role,
      nis_nip,
      nama,
      jenis_kelamin,
      tanggal_lahir,
      member_expired,
      institute,
      major,
      angkatan,
      tipe_keanggotaan,
      no_telp
    } = req.body;

    // Update user
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query(
        `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`,
        [username, hashedPassword, role, id]
      );
    } else {
      await connection.query(
        `UPDATE users SET username = ?, role = ? WHERE id = ?`,
        [username, role, id]
      );
    }

    console.log("✅ User updated:", id);

    // Update atau insert anggota
    const [anggotaCheck] = await connection.query(
      `SELECT id FROM anggota WHERE user_id = ?`,
      [id]
    );

    if (anggotaCheck.length > 0) {
      // Update anggota yang sudah ada
      await connection.query(
        `UPDATE anggota SET 
          nis_nip = ?, nama = ?, jenis_kelamin = ?, tanggal_lahir = ?,
          member_expired = ?, institute = ?, major = ?, angkatan = ?,
          tipe_keanggotaan = ?, no_telp = ?
        WHERE user_id = ?`,
        [
          nis_nip || null, nama || null, jenis_kelamin || null, tanggal_lahir || null,
          member_expired || null, institute || null, major || null, angkatan || null,
          tipe_keanggotaan || null, no_telp || null, id
        ]
      );
      console.log("✅ Anggota updated for user ID:", id);
    } else if (nama) {
      // Insert anggota baru
      await connection.query(
        `INSERT INTO anggota (
          user_id, nis_nip, nama, jenis_kelamin, tanggal_lahir,
          member_expired, institute, major, angkatan, tipe_keanggotaan, no_telp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, nis_nip || null, nama, jenis_kelamin || null, tanggal_lahir || null,
          member_expired || null, institute || null, major || null, angkatan || null, 
          tipe_keanggotaan || null, no_telp || null
        ]
      );
      console.log("✅ Anggota created for user ID:", id);
    }

    await connection.commit();
    res.json({ message: "User dan anggota berhasil diperbarui" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error PUT user:", err.message);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }
    
    res.status(500).json({ message: "Gagal mengubah data user", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ DELETE user + anggota
router.delete("/:id", async (req, res) => {
  let connection;
  
  try {
    console.log("📥 Request DELETE /api/admin/users/" + req.params.id);
    
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;

    // Hapus anggota terlebih dahulu (foreign key)
    await connection.query(`DELETE FROM anggota WHERE user_id = ?`, [id]);
    console.log("✅ Anggota deleted for user ID:", id);

    // Hapus user
    await connection.query(`DELETE FROM users WHERE id = ?`, [id]);
    console.log("✅ User deleted:", id);

    await connection.commit();
    res.json({ message: "User dan anggota berhasil dihapus" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("❌ Error DELETE user:", err.message);
    res.status(500).json({ message: "Gagal menghapus data user", error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export default router;