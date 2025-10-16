import db from '../config/db.js';

// Ambil semua buku
export const getAllBooks = (req, res) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

// Tambah buku baru
export const addBook = (req, res) => {
  const { kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, tanggal_masuk, tanggal_keluar } = req.body;
  const cover = req.file ? req.file.filename : null;

  const sql = `INSERT INTO books 
    (kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, tanggal_masuk, tanggal_keluar, cover) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, tanggal_masuk, tanggal_keluar, cover], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Buku berhasil ditambahkan!' });
  });
};

// Update buku
export const updateBook = (req, res) => {
  const { id } = req.params;
  const { kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, tanggal_masuk, tanggal_keluar } = req.body;
  const cover = req.file ? req.file.filename : null;

  let sql, params;
  if (cover) {
    sql = `UPDATE books SET 
      kode_buku=?, judul=?, pembuat=?, penerbit=?, bahasa_buku=?, tahun_rilis=?, isbn_issn=?, kategori=?, sinopsis=?, stok=?, tanggal_masuk=?, tanggal_keluar=?, cover=? 
      WHERE id=?`;
    params = [kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, tanggal_masuk, tanggal_keluar, cover, id];
  } else {
    sql = `UPDATE books SET 
      kode_buku=?, judul=?, pembuat=?, penerbit=?, bahasa_buku=?, tahun_rilis=?, isbn_issn=?, kategori=?, sinopsis=?, stok=?, tanggal_masuk=?, tanggal_keluar=? 
      WHERE id=?`;
    params = [kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, tanggal_masuk, tanggal_keluar, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Buku berhasil diperbarui!' });
  });
};
