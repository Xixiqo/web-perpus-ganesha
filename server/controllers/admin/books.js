import db from "../../config/db.js";
import fs from "fs";
import path from "path";

// GET /api/admin/books
export const getBooks = (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST /api/admin/books
export const createBook = (req, res) => {
  const {
    kode_buku,
    judul,
    pembuat,
    penerbit,
    bahasa_buku,
    tahun_rilis,
    isbn_issn,
    kategori,
    sinopsis,
    stok,
  } = req.body;

  const cover = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO books
    (kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, cover, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis, isbn_issn, kategori, sinopsis, stok, cover],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Buku berhasil ditambahkan", id: result.insertId });
    }
  );
};

// PUT /api/admin/books/:id
export const updateBook = (req, res) => {
  const { id } = req.params;
  const {
    kode_buku,
    judul,
    pembuat,
    penerbit,
    bahasa_buku,
    tahun_rilis,
    isbn_issn,
    kategori,
    sinopsis,
    stok,
  } = req.body;

  let cover = req.file ? req.file.filename : null;

  // Ambil cover lama untuk dihapus jika ada update
  db.query("SELECT cover FROM books WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const oldCover = results[0]?.cover;

    const sql = `
      UPDATE books SET kode_buku=?, judul=?, pembuat=?, penerbit=?, bahasa_buku=?, tahun_rilis=?, isbn_issn=?, kategori=?, sinopsis=?, stok=?, updated_at=NOW()
      ${cover ? ", cover=?" : ""}
      WHERE id=?
    `;

    const params = [
      kode_buku,
      judul,
      pembuat,
      penerbit,
      bahasa_buku,
      tahun_rilis,
      isbn_issn,
      kategori,
      sinopsis,
      stok,
    ];

    if (cover) params.push(cover);
    params.push(id);

    db.query(sql, params, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // hapus file lama jika ada cover baru
      if (cover && oldCover) {
        const oldPath = path.join("uploads", oldCover);
        fs.unlink(oldPath, (err) => { if (err) console.log(err); });
      }

      res.json({ message: "Buku berhasil diperbarui" });
    });
  });
};

// DELETE /api/admin/books/:id
export const deleteBook = (req, res) => {
  const { id } = req.params;

  // ambil cover dulu
  db.query("SELECT cover FROM books WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const cover = results[0]?.cover;

    db.query("DELETE FROM books WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // hapus cover file
      if (cover) {
        const coverPath = path.join("uploads", cover);
        fs.unlink(coverPath, (err) => { if (err) console.log(err); });
      }

      res.json({ message: "Buku berhasil dihapus" });
    });
  });
};
