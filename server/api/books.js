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

    const transformedBooks = books.map(book => ({
      ...book,
      tanggal_masuk: book.tanggal_masuk ? new Date(book.tanggal_masuk).toISOString().split('T')[0] : null,
      tanggal_keluar: book.tanggal_keluar ? new Date(book.tanggal_keluar).toISOString().split('T')[0] : null,
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

router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const searchTerm = `%${q || ""}%`;
    const [results] = await pool.query(
      `SELECT * FROM books 
      WHERE judul LIKE ? 
      OR pembuat LIKE ? 
      OR penerbit LIKE ? 
      OR sinopsis LIKE ?`,
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
      "SELECT DISTINCT kategori FROM books WHERE kategori IS NOT NULL"
    );
    res.json(categories.map((r) => r.kategori));
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Error retrieving categories" });
  }
});

// 📖 Detail buku berdasarkan ID - PENTING: Harus di paling bawah!
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  console.log('📖 Fetching book detail for ID:', id);
  
  // Validasi ID harus berupa angka
  if (!/^\d+$/.test(id)) {
    console.log('❌ Invalid ID format:', id);
    return res.status(400).json({ 
      success: false,
      message: "ID buku tidak valid" 
    });
  }
  
  try {
    // Ambil data buku utama
    const [books] = await pool.query(
      `SELECT 
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
      WHERE id = ?`,
      [id]
    );

    if (books.length === 0) {
      console.log('❌ Book not found with ID:', id);
      return res.status(404).json({ 
        success: false,
        message: "Buku tidak ditemukan" 
      });
    }

    const book = books[0];
    console.log('✅ Book found:', book.judul);

    // Ambil buku terkait (same category atau same author)
    const [relatedBooks] = await pool.query(
      `SELECT 
        id,
        judul,
        pembuat,
        tahun_rilis,
        cover
      FROM books 
      WHERE (kategori = ? OR pembuat = ?) 
        AND id != ? 
      LIMIT 4`,
      [book.kategori, book.pembuat, id]
    );

    console.log('📚 Related books found:', relatedBooks.length);

    // Transform related books
    const transformedRelated = relatedBooks.map(rb => ({
      id: rb.id,
      title: rb.judul,
      author: rb.pembuat,
      year: rb.tahun_rilis,
      reviews: Math.floor(Math.random() * 200) + 50,
      cover: rb.cover
    }));

    // Transform main book data
    const transformedBook = {
      id: book.id,
      title: book.judul,
      author: book.pembuat,
      publishDate: book.tahun_rilis,
      cover: book.cover,
      description: book.sinopsis || 'Tidak ada deskripsi tersedia.',
      publisher: book.penerbit,
      isbn: book.isbn_issn,
      pages: '336',
      language: book.bahasa_buku,
      category: book.kategori,
      rating: 4,
      reviewCount: Math.floor(Math.random() * 200) + 50,
      readerCount: Math.floor(Math.random() * 5000) + 1000,
      isFirstRead: false,
      isBestOfMonth: Math.random() > 0.5,
      isReaderChoice: Math.random() > 0.5,
      bookLink: `#/buku/${book.id}`,
      authorLink: `#/author/${encodeURIComponent(book.pembuat)}`,
      relatedBooks: transformedRelated,
      availability: [
        { 
          location: 'Ganesha Lantai 1', 
          callNumber: `${book.kode_buku}`, 
          code: book.kode_buku, 
          status: book.stok > 0 ? 'Tersedia' : 'Tidak Tersedia' 
        }
      ]
    };

    console.log('✅ Sending book detail response');
    res.json(transformedBook);
    
  } catch (error) {
    console.error("❌ Error fetching book detail:", error);
    res.status(500).json({ 
      success: false,
      message: "Terjadi kesalahan saat mengambil detail buku" 
    });
  }
});

export default router;