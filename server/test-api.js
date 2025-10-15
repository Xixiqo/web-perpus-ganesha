import pool from './config/db.js';

console.log('Starting database tests...');

async function runTests() {
    try {
        // Test koneksi database
        const connection = await pool.getConnection();
        console.log('✅ Successfully connected to database!');

        // Test query untuk mengambil semua buku
        console.log('\nTesting book retrieval...');
        const [books] = await connection.query('SELECT * FROM books');
        console.log('✅ Successfully retrieved books');
        console.log(`📚 Found ${books.length} books`);
        if (books.length > 0) {
            console.log('\nSample book:', JSON.stringify(books[0], null, 2));
        }

        // Test query pencarian
        const searchTerm = 'hujan';
        console.log(`\nTesting search for "${searchTerm}"...`);
        const searchQuery = `
            SELECT * FROM books 
            WHERE judul LIKE ? 
            OR pembuat LIKE ? 
            OR penerbit LIKE ? 
            OR sinopsis LIKE ?
        `;
        const searchTermPattern = `%${searchTerm}%`;
        const [searchResults] = await connection.query(
            searchQuery,
            [searchTermPattern, searchTermPattern, searchTermPattern, searchTermPattern]
        );
        
        console.log('✅ Search query executed successfully');
        console.log(`📚 Found ${searchResults.length} books matching "${searchTerm}"`);
        if (searchResults.length > 0) {
            console.log('\nSearch results:', JSON.stringify(searchResults, null, 2));
        }

        // Test query kategori
        console.log('\nTesting categories retrieval...');
        const [categories] = await connection.query('SELECT DISTINCT kategori FROM books');
        console.log('✅ Successfully retrieved categories');
        console.log('📚 Categories:', categories.map(r => r.kategori).join(', '));

        // Release connection
        connection.release();
        console.log('\n✅ All tests completed successfully!');

        // Close pool and exit
        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error);
        try {
            await pool.end();
        } catch (err) {
            console.error('Error closing pool:', err);
        }
        process.exit(1);
    }
}

runTests();