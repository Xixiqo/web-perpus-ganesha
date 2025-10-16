import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";

// 🧩 Tentukan lokasi file .env secara eksplisit
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("🧩 Loaded .env from:", path.join(__dirname, ".env"));
console.log("🧩 ENV TEST:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "****" : "(empty)",
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

// === app setup ===
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json());

// Middleware untuk logging request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Static files untuk akses cover buku
// ✅ Ganti "./uploads" jadi "/uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
import authRoutes from "./api/auth.js";
import profileRoutes from "./api/profile.js";
import booksRoutes from "./api/books.js";
import searchRoutes from "./api/search.js";
import peminjamanRoutes from "./api/riwayat.js";
import categoriesRoutes from "./api/categories.js";
import adminBooksRoutes from "./api/admin/books.js";

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/riwayat", peminjamanRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/admin/books", adminBooksRoutes);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
