-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    pembuat VARCHAR(255),
    penerbit VARCHAR(255),
    tahun_terbit YEAR,
    isbn VARCHAR(50),
    category_id INT,
    stok INT DEFAULT 0,
    cover VARCHAR(255),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    user_id INT,
    rating DECIMAL(3,1),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some default categories
INSERT INTO categories (name, icon, color) VALUES
('Fiksi', '📖', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
('Fiksi Fantasi', '🐉', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'),
('Romansa', '💕', 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'),
('Komedi', '😂', 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'),
('Pengembangan Diri', '🌱', 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'),
('Ekonomi', '💰', 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'),
('Klasik', '📚', 'linear-gradient(135deg, #868f96 0%, #596164 100%)'),
('Motivasi', '🔥', 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)');