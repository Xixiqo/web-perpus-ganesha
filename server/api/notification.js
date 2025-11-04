// routes/notification.js

import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const router = express.Router();

// ========================
// 🔒 Middleware: Auth Check
// ========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Silakan login terlebih dahulu.' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', async (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid.' });
    }
    
    // Get anggota data
    try {
      const [anggota] = await db.query('SELECT * FROM anggota WHERE user_id = ?', [user.id]);
      if (anggota && anggota.length > 0) {
        req.user = { ...user, id_anggota: anggota[0].id };
      } else {
        req.user = user;
      }
      next();
    } catch (error) {
      console.error('Error getting anggota:', error);
      req.user = user;
      next();
    }
  });
};

// ========================
// 🔒 Middleware: Admin Check
// ========================
const checkAdmin = async (req, res, next) => {
  try {
    const [user] = await db.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
    
    if (!user || user.length === 0) {
      return res.status(403).json({ message: 'User tidak ditemukan.' });
    }
    
    if (user[0].role !== 'pustakawan') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat mengakses.' });
    }
    
    next();
  } catch (error) {
    console.error('Error checking admin:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// ===== ADMIN ENDPOINTS (HARUS DI ATAS SEBELUM USER ENDPOINTS DENGAN :id) =====

// GET broadcast history
// GET broadcast history
router.get('/admin/broadcast/history', authenticateToken, checkAdmin, async (req, res) => {
  try {
    console.log('📊 Loading broadcast history...');
    
    const [broadcasts] = await db.query(`
      SELECT 
        MIN(n.id_notifikasi) as id_notifikasi,
        n.judul,
        n.pesan,
        n.icon,
        CONVERT_TZ(MIN(n.created_at), '+00:00', '+07:00') as created_at,
        COUNT(DISTINCT n.id_anggota) as recipient_count,
        COUNT(DISTINCT CASE WHEN n.is_read = 1 THEN n.id_anggota END) as read_count
      FROM notifikasi n
      WHERE n.tipe = 'broadcast'
      GROUP BY n.judul, n.pesan, n.icon
      ORDER BY MIN(n.created_at) DESC
      LIMIT 20
    `);
    
    console.log(`✅ Found ${broadcasts.length} broadcast(s)`);
    
    res.json({ broadcasts });
  } catch (error) {
    console.error('❌ Error loading broadcast history:', error);
    res.status(500).json({ message: 'Gagal memuat riwayat broadcast' });
  }
});

// POST broadcast notification
router.post('/admin/broadcast', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { tipe, judul, pesan, icon } = req.body;
    
    console.log('📢 Sending broadcast:', { tipe, judul, icon });
    
    // Validasi input
    if (!judul || !pesan) {
      return res.status(400).json({ message: 'Judul dan pesan harus diisi' });
    }
    
    // Get all active members
    const [members] = await db.query(`
      SELECT id as id_anggota
      FROM anggota 
      WHERE member_expired >= CURDATE()
    `);
    
    console.log(`👥 Found ${members.length} active members`);
    
    if (members.length === 0) {
      return res.status(400).json({ message: 'Tidak ada anggota aktif' });
    }
    
    // Insert notification for each member dengan timestamp yang sama
    const values = members.map(m => [
      m.id_anggota,
      null, // id_peminjaman
      tipe || 'broadcast',
      judul,
      pesan,
      icon || '📢'
    ]);
    
    await db.query(`
      INSERT INTO notifikasi 
      (id_anggota, id_peminjaman, tipe, judul, pesan, icon) 
      VALUES ?
    `, [values]);
    
    console.log(`✅ Broadcast sent to ${members.length} members`);
    
    res.json({
      success: true,
      message: 'Broadcast berhasil dikirim',
      recipientCount: members.length
    });
  } catch (error) {
    console.error('❌ Error sending broadcast:', error);
    res.status(500).json({ message: 'Gagal mengirim broadcast' });
  }
});

// ===== USER ENDPOINTS =====

// GET user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const id_anggota = req.user.id_anggota;
    
    if (!id_anggota) {
      return res.status(400).json({ message: 'Anda belum terdaftar sebagai anggota.' });
    }
    
    const [notifications] = await db.query(`
      SELECT 
        n.*,
        p.id_buku,
        b.judul as judul_buku,
        b.kode_buku
      FROM notifikasi n
      LEFT JOIN peminjaman p ON n.id_peminjaman = p.id_peminjaman
      LEFT JOIN books b ON p.id_buku = b.id
      WHERE n.id_anggota = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `, [id_anggota]);
    
    const [unreadResult] = await db.query(`
      SELECT COUNT(*) as count 
      FROM notifikasi 
      WHERE id_anggota = ? AND is_read = FALSE
    `, [id_anggota]);
    
    res.json({
      notifications,
      unreadCount: unreadResult[0].count
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Gagal memuat notifikasi' });
  }
});

// PUT mark all as read - HARUS SEBELUM /:id routes
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const id_anggota = req.user.id_anggota;
    
    if (!id_anggota) {
      return res.status(400).json({ message: 'Anda belum terdaftar sebagai anggota.' });
    }
    
    await db.query(`
      UPDATE notifikasi 
      SET is_read = TRUE 
      WHERE id_anggota = ?
    `, [id_anggota]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: 'Gagal menandai semua notifikasi' });
  }
});

// PUT mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const id_anggota = req.user.id_anggota;
    
    if (!id_anggota) {
      return res.status(400).json({ message: 'Anda belum terdaftar sebagai anggota.' });
    }
    
    await db.query(`
      UPDATE notifikasi 
      SET is_read = TRUE 
      WHERE id_notifikasi = ? AND id_anggota = ?
    `, [id, id_anggota]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ message: 'Gagal menandai notifikasi' });
  }
});

// DELETE notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const id_anggota = req.user.id_anggota;
    
    if (!id_anggota) {
      return res.status(400).json({ message: 'Anda belum terdaftar sebagai anggota.' });
    }
    
    await db.query(`
      DELETE FROM notifikasi 
      WHERE id_notifikasi = ? AND id_anggota = ?
    `, [id, id_anggota]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Gagal menghapus notifikasi' });
  }
});

// ===== HELPER FUNCTION =====

// Function to create notification (called from other routes)
export async function createNotification(id_anggota, id_peminjaman, tipe, judul, pesan, icon = '📚') {
  try {

      if (tipe?.includes('approved')) validType = 'peminjaman_approved'
      else if (tipe?.includes('rejected')) validType = 'peminjaman_rejected'
      else if (tipe?.includes('dipinjam')) validType = 'peminjaman_dipinjam'
      else if (tipe?.includes('terlambat')) validType = 'peminjaman_terlambat'
      else if (tipe === 'broadcast') validType = 'broadcast'

      await db.query(`
        INSERT INTO notifikasi 
        (id_anggota, id_peminjaman, tipe, judul, pesan, icon, created_at)
        VALUES (?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), '+00:00', '+07:00'))
      `, [id_anggota, id_peminjaman, validType, judul, pesan, icon])
      ;
    
    console.log(`✅ Notifikasi created for user ${id_anggota}: ${judul}`);
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
}

// Export default router
export default router;