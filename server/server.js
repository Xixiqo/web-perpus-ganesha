import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ===== Middleware uploads dengan fallback =====
const uploadsPath = path.join(__dirname, "uploads");
const placeholderPath = path.join(__dirname, "placeholder-cover.svg");

app.use("/uploads", (req, res, next) => {
  const filePath = path.join(uploadsPath, req.path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // file tidak ada → fallback ke placeholder
      return res.sendFile(placeholderPath);
    }
    next();
  });
}, express.static(uploadsPath));

// ===== Import dan register API routes =====
// (sesuaikan dengan kode sebelumnya)
import authRoutes from "./api/auth.js";
import profileRoutes from "./api/profile.js";
import booksRoutes from "./api/books.js";
import riwayatRoutes from "./api/riwayat.js";

// === ADMIN ROUTES (versi baru dengan double 'n') ===
import adminpinjam_manageRoutes from "./api/admin/pinjam_manage.js";
import adminkembali_manageRoutes from "./api/admin/kembali_manage.js";

// === ADMIN ROUTES (versi lama - single 'n') ===
import adminPeminjamanRoutes from "./api/admin/peminjaman.js";
import adminPengembalianRoutes from "./api/admin/pengembalian.js";
import ProcessPeminjamanRoutes from "./api/peminjaman.js"

// === ADMIN ROUTES (lainnya) ===
import adminBooksRoutes from "./api/admin/books.js";

console.log("✅ All route modules imported successfully");

// ============================================
// 🛣️ REGISTER API ROUTES
// ============================================
// ⚠️ CRITICAL: API routes HARUS didaftarkan SEBELUM frontend static files

console.log("📝 Registering API routes...");

// === ADMIN ROUTES - NEW (dengan double 'n') ===
app.use("/api/admin/pinjam_manage", adminpinjam_manageRoutes);
console.log("   ✓ Registered: /api/admin/pinjam_manage");

app.use("/api/admin/kembali_manage", adminkembali_manageRoutes);
console.log("   ✓ Registered: /api/admin/kembali_manage");

// === ADMIN ROUTES - OLD (single 'n') ===
app.use("/api/admin/peminjaman", adminPeminjamanRoutes);
console.log("   ✓ Registered: /api/admin/peminjaman");

app.use("/api/admin/pengembalian", adminPengembalianRoutes);
console.log("   ✓ Registered: /api/admin/pengembalian");

// === ADMIN ROUTES - OTHER ===
app.use("/api/admin/users", adminUsersRoutes);
console.log("   ✓ Registered: /api/admin/users");

app.use("/api/admin/books", adminBooksRoutes);
console.log("   ✓ Registered: /api/admin/books");

// === PUBLIC/USER ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/riwayat", riwayatRoutes);

// ===== Frontend Vue build =====
const frontendPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    if (req.url.startsWith("/api/")) return res.status(404).json({ error: "API not found" });
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
