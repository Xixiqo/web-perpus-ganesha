import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// 🔧 Helper function untuk generate slug
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, 'dan')           // Replace & with 'dan'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// 📚 Ambil semua buku
router.get("/", async (req, res) => {
  try {
    const [books] = await pool.query(`
      SELECT 
        id,
        kode_buku,
        judul,
        slug,
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

// 📖 Detail buku berdasarkan SLUG - PENTING: Harus di paling bawah!
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  
  console.log('📖 Fetching book detail for slug:', slug);
  
  // Validasi slug tidak boleh kosong
  if (!slug || slug.trim() === '') {
    console.log('❌ Invalid slug:', slug);
    return res.status(400).json({ 
      success: false,
      message: "Slug buku tidak valid" 
    });
  }
  
  try {
    // Ambil data buku utama berdasarkan slug
    const [books] = await pool.query(
      `SELECT 
        id,
        kode_buku,
        judul,
        slug,
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
      WHERE slug = ?`,
      [slug]
    );

    if (books.length === 0) {
      console.log('❌ Book not found with slug:', slug);
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
        slug,
        pembuat,
        tahun_rilis,
        cover
      FROM books 
      WHERE (kategori = ? OR pembuat = ?) 
        AND id != ? 
      LIMIT 4`,
      [book.kategori, book.pembuat, book.id]
    );

    console.log('📚 Related books found:', relatedBooks.length);

    // Transform related books
    const transformedRelated = relatedBooks.map(rb => ({
      id: rb.id,
      slug: rb.slug,
      title: rb.judul,
      author: rb.pembuat,
      year: rb.tahun_rilis,
      reviews: Math.floor(Math.random() * 200) + 50,
      cover: rb.cover
    }));

    // Transform main book data
    const transformedBook = {
      id: book.id,
      slug: book.slug,
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
      bookLink: `#/buku/${book.slug}`,
      authorLink: `#/author/${encodeURIComponent(book.pembuat)}`,
      stok: Number(book.stok) || 0,
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

// 📝 Tambah buku baru (POST)
router.post("/", async (req, res) => {
  try {
    const { judul, ...otherData } = req.body;
    const slug = generateSlug(judul);
    
    // Cek apakah slug sudah ada
    const [existing] = await pool.query(
      "SELECT id FROM books WHERE slug = ?",
      [slug]
    );
    
    if (existing.length > 0) {
      // Tambahkan timestamp untuk membuat slug unik
      const uniqueSlug = `${slug}-${Date.now()}`;
      const [result] = await pool.query(
        "INSERT INTO books (judul, slug, ...) VALUES (?, ?, ...)",
        [judul, uniqueSlug, ...Object.values(otherData)]
      );
      return res.json({ success: true, id: result.insertId, slug: uniqueSlug });
    }
    
    const [result] = await pool.query(
      "INSERT INTO books (judul, slug, ...) VALUES (?, ?, ...)",
      [judul, slug, ...Object.values(otherData)]
    );
    
    res.json({ success: true, id: result.insertId, slug });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ success: false, message: "Error creating book" });
  }
});

export default router;