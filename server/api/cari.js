const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Middleware untuk logging
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (Object.keys(req.query).length > 0) {
        console.log('Query params:', req.query);
    }
    next();
};

router.use(logRequest);

// Endpoint untuk mendapatkan semua buku
router.get('/books', async (req, res) => {
    try {
        const query = 'SELECT * FROM books';
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching books:', error);
                return res.status(500).json({ message: 'Error fetching books' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint untuk pencarian buku
router.get('/books/search', async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const kategori = req.query.kategori;

        console.log('Search request received:', { searchQuery, kategori });

        let query = 'SELECT * FROM books WHERE 1=1';
        const params = [];

        if (searchQuery) {
            query += ` AND (judul LIKE ? OR pembuat LIKE ? OR penerbit LIKE ? OR sinopsis LIKE ?)`;
            const searchTerm = `%${searchQuery}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (kategori) {
            query += ` AND kategori = ?`;
            params.push(kategori);
        }

        console.log('Executing query:', query);
        console.log('With parameters:', params);

        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error searching books:', error);
                return res.status(500).json({ message: 'Error searching books' });
            }
            
            console.log(`Found ${results.length} books matching criteria`);
            if (results.length > 0) {
                console.log('Sample result:', results[0]);
            }

            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint untuk mendapatkan kategori unik
router.get('/books/categories', async (req, res) => {
    try {
        const query = 'SELECT DISTINCT kategori FROM books';
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching categories:', error);
                return res.status(500).json({ message: 'Error fetching categories' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;