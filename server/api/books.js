import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// 📚 Ambil semua buku
router.get("/", async (req, res) => {
  try {
    const [books] = await pool.query("SELECT * FROM books");
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error retrieving books" });
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
