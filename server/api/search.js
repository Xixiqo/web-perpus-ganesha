import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Endpoint untuk mencari buku
router.get('/books', async (req, res) => {
    try {
        const { query, category } = req.query;
        const connection = await pool.getConnection();

        let searchQuery = `
            SELECT * FROM books 
            WHERE 1=1
        `;
        const params = [];

        // Tambahkan filter pencarian jika query ada
        if (query) {
            searchQuery += ` AND (
                judul LIKE ? OR 
                pembuat LIKE ? OR 
                penerbit LIKE ? OR 
                sinopsis LIKE ?
            )`;
            const searchPattern = `%${query}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        // Tambahkan filter kategori jika category ada
        if (category) {
            searchQuery += ` AND kategori = ?`;
            params.push(category);
        }

        // Eksekusi query
        const [books] = await connection.query(searchQuery, params);
        connection.release();

        res.json({
            success: true,
            data: books,
            total: books.length
        });

    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mencari buku',
            error: error.message
        });
    }
});

// Endpoint untuk mendapatkan semua kategori
router.get('/categories', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [categories] = await connection.query('SELECT DISTINCT kategori as name FROM books');
        connection.release();

        res.json({
            success: true,
            data: categories.map((cat, index) => ({
                id: cat.name,
                name: cat.name
            }))
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil kategori',
            error: error.message
        });
    }
});

export default router;