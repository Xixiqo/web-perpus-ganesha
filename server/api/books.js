import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// 📚 Ambil semua buku
router.get("/", async (req, res) => {
  try {
    const [books] = await pool.query(`
      SELECT 
        id,
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
        cover,
        tanggal_masuk,
        tanggal_keluar,
        created_at,
        updated_at
      FROM books
      ORDER BY created_at DESC
    `);

    // Transform data before sending
    const transformedBooks = books.map(book => ({
      ...book,
      // Ensure dates are formatted properly
      tanggal_masuk: book.tanggal_masuk ? new Date(book.tanggal_masuk).toISOString().split('T')[0] : null,
      tanggal_keluar: book.tanggal_keluar ? new Date(book.tanggal_keluar).toISOString().split('T')[0] : null,
      // Add default rating if needed
      rating: "0.0",
      review_count: 0
    }));

    res.json(transformedBooks);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ 
      success: false,
      message: "Terjadi kesalahan saat mengambil data buku" 
    });
  }
});

// 🔍 Pencarian buku berdasarkan kata kunci
router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const searchTerm = `%${q || ""}%`;
    const [results] = await pool.query(
      `
      SELECT * FROM books 
      WHERE judul LIKE ? 
      OR pembuat LIKE ? 
      OR penerbit LIKE ? 
      OR sinopsis LIKE ?
      `,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );
    res.json(results);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Error searching books" });
  }
});

// 🏷️ Ambil kategori unik
router.get("/categories", async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT DISTINCT kategori FROM books"
    );
    res.json(categories.map((r) => r.kategori));
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Error retrieving categories" });
  }
});

export default router;
