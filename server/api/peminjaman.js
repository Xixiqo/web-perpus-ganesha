// 📁 server/api/peminjaman.js
import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'
import { createNotification } from './notification.js'

const router = express.Router()

// ========================
// 🔒 Middleware: Autentikasi Token
// ========================
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu.' })
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token tidak valid.' })
      }
      req.user = user
      next()
    })
  } catch (error) {
    console.error('❌ Error autentikasi token:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa token.' })
  }
}

// ========================
// 👥 Fungsi: Cek Keanggotaan
// ========================
const checkMembership = async (userId) => {
  const [anggota] = await db.query('SELECT * FROM anggota WHERE user_id = ?', [userId])

  if (!anggota || anggota.length === 0) {
    return { isActive: false, reason: 'not_member' }
  }

  const member = anggota[0]
  if (!member.member_expired) {
    return { isActive: false, reason: 'no_expiry_date' }
  }

  const today = new Date()
  const expired = new Date(member.member_expired)

  if (expired < today) {
    return { isActive: false, reason: 'expired' }
  }

  return { isActive: true, member }
}

// ========================
// 📚 POST: Ajukan Peminjaman Buku
// ========================
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id_buku, tanggal_pinjam } = req.body
    const userId = req.user.id

    // 1️⃣ Periksa keanggotaan
    const membership = await checkMembership(userId)
    if (!membership.isActive) {
      const message =
        membership.reason === 'expired'
          ? 'Keanggotaan Anda sudah kedaluwarsa.'
          : 'Anda belum menjadi anggota perpustakaan.'
      return res.status(403).json({ message, requireMembership: true })
    }

    const id_anggota = membership.member.id

    // 2️⃣ Cek pengajuan aktif
    const [existing] = await db.query(
      `SELECT * FROM peminjaman 
       WHERE id_anggota = ? AND id_buku = ? 
       AND status IN ("Pending", "Dipinjam")`,
      [id_anggota, id_buku]
    )

    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Anda sudah memiliki pengajuan aktif untuk buku ini.',
        hasPending: true
      })
    }

    // 3️⃣ Cek stok buku
    const [book] = await db.query('SELECT stok, judul FROM books WHERE id = ?', [id_buku])
    if (book.length === 0)
      return res.status(404).json({ message: 'Buku tidak ditemukan.' })

    if (book[0].stok <= 0) {
      return res.status(400).json({
        message: 'Stok buku sudah habis.',
        outOfStock: true
      })
    }

    console.log('🟢 Pengajuan peminjaman:', { id_buku, tanggal_pinjam, userId })

    // 4️⃣ Simpan peminjaman
    const [insertResult] = await db.query(
      `INSERT INTO peminjaman (id_anggota, id_buku, tanggal_pinjam, status)
       VALUES (?, ?, ?, 'Pending')`,
      [id_anggota, id_buku, tanggal_pinjam]
    )

    // 5️⃣ Kurangi stok buku
    await db.query('UPDATE books SET stok = stok - 1 WHERE id = ?', [id_buku])

    // 6️⃣ Kirim notifikasi ke user
    await createNotification(
      id_anggota,
      insertResult.insertId,
      'peminjaman_pending',
      'Pengajuan Peminjaman Buku',
      `Buku "${book[0].judul}" berhasil diajukan. Menunggu konfirmasi pustakawan.`,
      '📘'
    )

    // 7️⃣ Response
    const [updatedBook] = await db.query('SELECT stok FROM books WHERE id = ?', [id_buku])
    return res.status(201).json({
      message: 'Peminjaman berhasil diajukan, menunggu konfirmasi petugas.',
      newStock: updatedBook[0].stok,
      hasPending: true
    })
  } catch (error) {
    console.error('❌ Error peminjaman:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
  }
})

export default router
