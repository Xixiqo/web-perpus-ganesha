import db from "../../config/db.js";
import fs from "fs/promises";
import path from "path";

const UPLOAD_FOLDER = path.join(process.cwd(), "uploads");

// GET
export const getBooks = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM books");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const createBook = async (req, res) => {
  try {
    const {
      kode_buku, judul, pembuat, penerbit, bahasa_buku,
      tahun_rilis, isbn_issn, kategori, sinopsis, stok
    } = req.body;

    const cover = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO books
      (kode_buku, judul, pembuat, penerbit, bahasa_buku, tahun_rilis,
       isbn_issn, kategori, sinopsis, stok, cover, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await db.query(sql, [
      kode_buku, judul, pembuat, penerbit, bahasa_buku,
      tahun_rilis, isbn_issn, kategori, sinopsis, stok, cover
    ]);

    res.json({ message: "Buku berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kode_buku, judul, pembuat, penerbit, bahasa_buku,
      tahun_rilis, isbn_issn, kategori, sinopsis, stok
    } = req.body;

    const cover = req.file ? req.file.filename : null;

    const [oldResult] = await db.query("SELECT cover FROM books WHERE id = ?", [id]);
    if (!oldResult.length)
      return res.status(404).json({ error: "Buku tidak ditemukan" });

    const oldCover = oldResult[0].cover;

    const sql = `
      UPDATE books SET 
        kode_buku=?, judul=?, pembuat=?, penerbit=?, bahasa_buku=?, tahun_rilis=?,
        isbn_issn=?, kategori=?, sinopsis=?, stok=?, updated_at=NOW()
        ${cover ? ", cover=?" : ""}
      WHERE id=?
    `;

    const params = [
      kode_buku, judul, pembuat, penerbit, bahasa_buku,
      tahun_rilis, isbn_issn, kategori, sinopsis, stok
    ];

    if (cover) params.push(cover);
    params.push(id);

    await db.query(sql, params);

    // Hapus file lama
    if (cover && oldCover) {
      const oldPath = path.join(UPLOAD_FOLDER, oldCover);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        if (err.code !== "ENOENT") console.error("Gagal hapus cover lama:", err);
      }
    }

    res.json({ message: "Buku berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("SELECT cover FROM books WHERE id = ?", [id]);
    if (!result.length)
      return res.status(404).json({ error: "Buku tidak ditemukan" });

    const cover = result[0].cover;
    await db.query("DELETE FROM books WHERE id = ?", [id]);

    if (cover) {
      const coverPath = path.join(UPLOAD_FOLDER, cover);
      try {
        await fs.unlink(coverPath);
      } catch (err) {
        if (err.code !== "ENOENT") console.error("Gagal hapus file cover:", err);
      }
    }

    res.json({ message: "Buku berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
