import express from 'express';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const router = express.Router();

// ============================================
// DATABASE CONNECTION POOL (Internal)
// ============================================
let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    connectTimeout: 10000,
    timezone: '+00:00'
  });
  
  console.log('✅ Articles: MySQL pool created');
} catch (error) {
  console.error('❌ Articles: Failed to create pool:', error.message);
}

// ============================================
// MULTER CONFIGURATION
// ============================================
const uploadsDir = path.join(__dirname, '../uploads/articles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function formatImagePath(image, req) {
  if (!image) return null;
  
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/articles/${path.basename(image)}`;
}

// ============================================
// ROUTES - ORDER MATTERS!
// Specific routes MUST come BEFORE dynamic /:id route
// ============================================

// GET /api/articles/recent - MUST BE BEFORE /:identifier
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const query = 'SELECT * FROM articles WHERE is_published = 1 ORDER BY created_at DESC LIMIT ?';
    const [articles] = await pool.query(query, [limit]);

    const formattedArticles = articles.map(article => ({
      ...article,
      cover_image: formatImagePath(article.cover_image, req),
      author_avatar: formatImagePath(article.author_avatar, req),
      image_1: formatImagePath(article.image_1, req),
      image_2: formatImagePath(article.image_2, req),
      image_3: formatImagePath(article.image_3, req)
    }));

    res.json({ success: true, data: formattedArticles });
  } catch (error) {
    console.error('❌ Error fetching recent articles:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil artikel terbaru', error: error.message });
  }
});

// GET /api/articles/popular - MUST BE BEFORE /:identifier
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const query = 'SELECT * FROM articles WHERE is_published = 1 ORDER BY views DESC LIMIT ?';
    const [articles] = await pool.query(query, [limit]);

    const formattedArticles = articles.map(article => ({
      ...article,
      cover_image: formatImagePath(article.cover_image, req),
      author_avatar: formatImagePath(article.author_avatar, req),
      image_1: formatImagePath(article.image_1, req),
      image_2: formatImagePath(article.image_2, req),
      image_3: formatImagePath(article.image_3, req)
    }));

    res.json({ success: true, data: formattedArticles });
  } catch (error) {
    console.error('❌ Error fetching popular articles:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil artikel populer', error: error.message });
  }
});

// GET /api/articles/categories - MUST BE BEFORE /:identifier
router.get('/categories', async (req, res) => {
  try {
    const query = `
      SELECT category, COUNT(*) as count 
      FROM articles 
      WHERE is_published = 1 
      GROUP BY category 
      ORDER BY count DESC
    `;
    const [categories] = await pool.query(query);

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori', error: error.message });
  }
});

// GET /api/articles - Get all articles with filters
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      is_published, 
      search, 
      page = 1, 
      limit = 10,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (is_published !== undefined) {
      query += ' AND is_published = ?';
      params.push(is_published);
    }

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const allowedSort = ['id', 'title', 'created_at', 'updated_at', 'views'];
    const allowedOrder = ['ASC', 'DESC'];
    
    const sortField = allowedSort.includes(sort) ? sort : 'created_at';
    const sortOrder = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [articles] = await pool.query(query, params);

    const formattedArticles = articles.map(article => ({
      ...article,
      cover_image: formatImagePath(article.cover_image, req),
      author_avatar: formatImagePath(article.author_avatar, req),
      image_1: formatImagePath(article.image_1, req),
      image_2: formatImagePath(article.image_2, req),
      image_3: formatImagePath(article.image_3, req)
    }));

    let countQuery = 'SELECT COUNT(*) as total FROM articles WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (is_published !== undefined) {
      countQuery += ' AND is_published = ?';
      countParams.push(is_published);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: formattedArticles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching articles:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil artikel', error: error.message });
  }
});

router.post('/:identifier/view', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);
    
    const query = isNumeric 
      ? 'UPDATE articles SET views = views + 1 WHERE id = ?'
      : 'UPDATE articles SET views = views + 1 WHERE slug = ?';
    
    await pool.query(query, [identifier]);

    res.json({ success: true, message: 'View count updated' });
  } catch (error) {
    console.error('❌ Error updating view count:', error.message);
    res.status(500).json({ success: false, message: 'Gagal update view count' });
  }
});

// GET /api/articles/:identifier - MUST BE LAST!
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);
    
    const query = isNumeric 
      ? 'SELECT * FROM articles WHERE id = ?'
      : 'SELECT * FROM articles WHERE slug = ?';
    
    const [articles] = await pool.query(query, [identifier]);

    if (articles.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    const article = articles[0];

    await pool.query('UPDATE articles SET views = views + 1 WHERE id = ?', [article.id]);
    article.views += 1;

    const formattedArticle = {
      ...article,
      cover_image: formatImagePath(article.cover_image, req),
      author_avatar: formatImagePath(article.author_avatar, req),
      image_1: formatImagePath(article.image_1, req),
      image_2: formatImagePath(article.image_2, req),
      image_3: formatImagePath(article.image_3, req)
    };

    res.json({ success: true, data: formattedArticle });
  } catch (error) {
    console.error('❌ Error fetching article:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil artikel', error: error.message });
  }
});

// POST /api/articles - Create article
router.post('/', upload.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'author_avatar', maxCount: 1 },
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      reading_time = 5,
      author_name = 'Admin',
      is_published = 1,
      cover_image_url,
      author_avatar_url,
      image_1_url,
      image_2_url,
      image_3_url
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, content, dan category wajib diisi' 
      });
    }

    const slug = generateSlug(title);

    const [existingSlugs] = await pool.query('SELECT slug FROM articles WHERE slug = ?', [slug]);
    if (existingSlugs.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artikel dengan judul serupa sudah ada' 
      });
    }

    const cover_image = req.files?.cover_image?.[0]?.filename || cover_image_url || null;
    const author_avatar = req.files?.author_avatar?.[0]?.filename || author_avatar_url || null;
    const image_1 = req.files?.image_1?.[0]?.filename || image_1_url || null;
    const image_2 = req.files?.image_2?.[0]?.filename || image_2_url || null;
    const image_3 = req.files?.image_3?.[0]?.filename || image_3_url || null;

    const query = `
      INSERT INTO articles (
        title, slug, cover_image, content, category, reading_time,
        author_name, author_avatar, image_1, image_2, image_3, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      title, slug, cover_image, content, category, reading_time,
      author_name, author_avatar, image_1, image_2, image_3, is_published
    ]);

    const [newArticle] = await pool.query('SELECT * FROM articles WHERE id = ?', [result.insertId]);

    const formattedArticle = {
      ...newArticle[0],
      cover_image: formatImagePath(newArticle[0].cover_image, req),
      author_avatar: formatImagePath(newArticle[0].author_avatar, req),
      image_1: formatImagePath(newArticle[0].image_1, req),
      image_2: formatImagePath(newArticle[0].image_2, req),
      image_3: formatImagePath(newArticle[0].image_3, req)
    };

    res.status(201).json({ 
      success: true, 
      message: 'Artikel berhasil dibuat', 
      data: formattedArticle 
    });
  } catch (error) {
    console.error('❌ Error creating article:', error.message);
    res.status(500).json({ success: false, message: 'Gagal membuat artikel', error: error.message });
  }
});

// PUT /api/articles/:id - Update article
router.put('/:id', upload.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'author_avatar', maxCount: 1 },
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      category,
      reading_time,
      author_name,
      is_published,
      cover_image_url,
      author_avatar_url,
      image_1_url,
      image_2_url,
      image_3_url
    } = req.body;

    const [existingArticles] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (existingArticles.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    const existingArticle = existingArticles[0];
    const updates = [];
    const params = [];

    if (title) {
      updates.push('title = ?');
      params.push(title);
      
      const newSlug = generateSlug(title);
      if (newSlug !== existingArticle.slug) {
        updates.push('slug = ?');
        params.push(newSlug);
      }
    }

    if (content) {
      updates.push('content = ?');
      params.push(content);
    }

    if (category) {
      updates.push('category = ?');
      params.push(category);
    }

    if (reading_time) {
      updates.push('reading_time = ?');
      params.push(reading_time);
    }

    if (author_name) {
      updates.push('author_name = ?');
      params.push(author_name);
    }

    if (is_published !== undefined) {
      updates.push('is_published = ?');
      params.push(is_published);
    }

    const imageFields = [
      { name: 'cover_image', url: cover_image_url },
      { name: 'author_avatar', url: author_avatar_url },
      { name: 'image_1', url: image_1_url },
      { name: 'image_2', url: image_2_url },
      { name: 'image_3', url: image_3_url }
    ];

    imageFields.forEach(({ name, url }) => {
      if (req.files?.[name]?.[0]) {
        const oldImage = existingArticle[name];
        if (oldImage && !oldImage.startsWith('http')) {
          const oldPath = path.join(uploadsDir, path.basename(oldImage));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        
        updates.push(`${name} = ?`);
        params.push(req.files[name][0].filename);
      } else if (url) {
        updates.push(`${name} = ?`);
        params.push(url);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data yang diupdate' });
    }

    params.push(id);
    const query = `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`;
    await pool.query(query, params);

    const [updatedArticle] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);

    const formattedArticle = {
      ...updatedArticle[0],
      cover_image: formatImagePath(updatedArticle[0].cover_image, req),
      author_avatar: formatImagePath(updatedArticle[0].author_avatar, req),
      image_1: formatImagePath(updatedArticle[0].image_1, req),
      image_2: formatImagePath(updatedArticle[0].image_2, req),
      image_3: formatImagePath(updatedArticle[0].image_3, req)
    };

    res.json({ 
      success: true, 
      message: 'Artikel berhasil diupdate', 
      data: formattedArticle 
    });
  } catch (error) {
    console.error('❌ Error updating article:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengupdate artikel', error: error.message });
  }
});

// DELETE /api/articles/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [articles] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (articles.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    const article = articles[0];

    const imageFields = ['cover_image', 'author_avatar', 'image_1', 'image_2', 'image_3'];
    imageFields.forEach(field => {
      const image = article[field];
      if (image && !image.startsWith('http')) {
        const imagePath = path.join(uploadsDir, path.basename(image));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    await pool.query('DELETE FROM articles WHERE id = ?', [id]);

    res.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error deleting article:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menghapus artikel', error: error.message });
  }
});

export default router;