import express from "express";
import multer from "multer";
import path from "path";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../controllers/admin/books.js";

const router = express.Router();

// Setup multer untuk upload cover
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getBooks);
router.post("/", upload.single("cover"), createBook);
router.put("/:id", upload.single("cover"), updateBook);
router.delete("/:id", deleteBook);

export default router;
