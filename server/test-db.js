const connection = require('./config/db');

// Test koneksi database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Successfully connected to database!');

    // Test query untuk mengambil semua buku
    connection.query('SELECT * FROM books', (error, results) => {
        if (error) {
            console.error('Error fetching books:', error);
            return;
        }
        console.log('Books found:', results.length);
        console.log('Sample book:', results[0]);

        // Test query pencarian
        const searchTerm = 'hujan';
        const searchQuery = `
            SELECT * FROM books 
            WHERE judul LIKE ? 
            OR pembuat LIKE ? 
            OR penerbit LIKE ? 
            OR sinopsis LIKE ?
        `;
        const searchTermPattern = `%${searchTerm}%`;
        const searchParams = [searchTermPattern, searchTermPattern, searchTermPattern, searchTermPattern];

        connection.query(searchQuery, searchParams, (searchError, searchResults) => {
            if (searchError) {
                console.error('Error searching books:', searchError);
                return;
            }
            console.log(`Search results for "${searchTerm}":`, searchResults.length);
            console.log('Search results:', searchResults);

            // Tutup koneksi setelah selesai
            connection.end();
        });
    });
});