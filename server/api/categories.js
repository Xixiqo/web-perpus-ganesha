import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get all categories with book count
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        kategori as name,
        COUNT(*) as bookCount
      FROM books 
      WHERE kategori IS NOT NULL
      GROUP BY kategori
      ORDER BY bookCount DESC
    `);

    res.json({
      success: true,
      categories: results.map(cat => {
        const style = getCategoryStyle(cat.name);
        return {
          id: style.id,
          name: cat.name,
          icon: style.icon,
          color: style.color,
          bookCount: Number(cat.bookCount),
          rating: "0.0" // Default rating since we don't have ratings table yet
        };
      })
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kategori'
    });
  }
});

// Helper function to get category style
function getCategoryStyle(categoryName) {
  const styles = {
    'Fiksi': {
      id: 1,
      icon: '📖',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    'Fiksi Fantasi': {
      id: 2,
      icon: '🐉',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    'Romansa': {
      id: 3,
      icon: '💕',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    'Komedi': {
      id: 4,
      icon: '😂',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    'Pengembangan Diri': {
      id: 5,
      icon: '🌱',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    'Ekonomi': {
      id: 6,
      icon: '💰',
      color: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
    },
    'Klasik': {
      id: 7,
      icon: '📚',
      color: 'linear-gradient(135deg, #868f96 0%, #596164 100%)'
    },
    'Motivasi': {
      id: 8,
      icon: '🔥',
      color: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
    },
    'Sejarah': {
      id: 9,
      icon: '🏛️',
      color: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)'
    }
  };

  return styles[categoryName] || {
    id: 99,
    icon: '📘',
    color: 'linear-gradient(135deg, #8E9EAB 0%, #eef2f3 100%)'
  };
}

export default router;