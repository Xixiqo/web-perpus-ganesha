import express from 'express';
import multer from 'multer';
import {
  getAllBooks,
  addBook,
  updateBook,
} from '../../controllers/adminbooksControllers.js';

const router = express.Router();

// Konfigurasi multer untuk upload cover
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.get('/', getAllBooks);
router.post('/add', upload.single('cover'), addBook);
router.put('/edit/:id', upload.single('cover'), updateBook);

export default router;
