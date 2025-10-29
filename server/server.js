// ============================================
// server.js - MAIN SERVER FILE
// ============================================

import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("🧩 Loaded .env from:", path.join(__dirname, ".env"));
console.log("🧩 ENV TEST:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "**" : "(empty)",
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

// ============================================
// 📦 EXPRESS APP SETUP
// ============================================
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
import adminPeminjamannRoutes from "./api/admin/peminjamann.js";
import adminPengembaliannRoutes from "./api/admin/pengembaliann.js";

// === ADMIN ROUTES (versi lama - single 'n') ===
import adminPeminjamanRoutes from "./api/admin/peminjaman.js";
import adminPengembalianRoutes from "./api/admin/pengembalian.js";
import adminUsersRoutes from "./api/admin/users.js";
import ProcessPeminjamanRoutes from "./api/peminjaman.js";
import searchRoutes from "./api/search.js";
import peminjamanRoutes from "./api/riwayat.js";
import categoriesRoutes from "./api/categories.js";


// === ADMIN ROUTES (lainnya) ===
import adminBooksRoutes from "./api/admin/books.js";

console.log("✅ All route modules imported successfully");

// ============================================
// 🛣️ REGISTER API ROUTES
// ============================================
console.log("📝 Registering API routes...");

// === ADMIN ROUTES - NEW (double 'n') ===
app.use("/api/admin/peminjamann", adminPeminjamannRoutes);
console.log("   ✓ Registered: /api/admin/peminjamann");

app.use("/api/admin/pengembaliann", adminPengembaliannRoutes);
console.log("   ✓ Registered: /api/admin/pengembaliann");

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
console.log("   ✓ Registered: /api/books");

app.use("/api/search", searchRoutes);
console.log("   ✓ Registered: /api/search");

app.use("/api/riwayat", riwayatRoutes);
console.log("   ✓ Registered: /api/riwayat");

app.use("/api/categories", categoriesRoutes);
console.log("   ✓ Registered: /api/categories");

// Route untuk peminjaman umum
app.use("/api/peminjaman", ProcessPeminjamanRoutes);

console.log("✅ All API routes registered\n");

// ============================================
// 🌐 FRONTEND HANDLER (Vue Build)
// ============================================

// ===== Frontend Vue build =====
const frontendPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    if (req.url.startsWith("/api/")) return res.status(404).json({ error: "API not found" });
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ============================================
// 🚀 START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log("\n" + "=".repeat(70));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}/`);
  console.log("=".repeat(70));
  console.log("📡 API Endpoints available:\n");

  console.log("   PUBLIC ROUTES:");
  console.log("   - POST   /api/auth/login");
  console.log("   - POST   /api/auth/register");
  console.log("   - GET    /api/books");
  console.log("   - GET    /api/categories");
  console.log("   - GET    /api/search");
  console.log("   - GET    /api/riwayat");
  console.log("   - GET    /api/profile\n");

  console.log("   ADMIN ROUTES (NEW - double n):");
  console.log("   - GET    /api/admin/peminjamann");
  console.log("   - GET    /api/admin/peminjamann/check/late  ⭐");
  console.log("   - GET    /api/admin/peminjamann/:id");
  console.log("   - PUT    /api/admin/peminjamann/:id/status");
  console.log("   - PUT    /api/admin/peminjamann/:id/return");
  console.log("   - DELETE /api/admin/peminjamann/:id");
  console.log("   - GET    /api/admin/pengembaliann");
  console.log("   - GET    /api/admin/pengembaliann/stats/summary");
  console.log("   - GET    /api/admin/pengembaliann/peminjaman/:id\n");

  console.log("   ADMIN ROUTES (OLD - single n):");
  console.log("   - GET    /api/admin/peminjaman");
  console.log("   - GET    /api/admin/pengembalian\n");

  console.log("   ADMIN ROUTES (OTHER):");
  console.log("   - GET    /api/admin/users");
  console.log("   - GET    /api/admin/books");
  console.log("=".repeat(70));
  console.log("⚠️  IMPORTANT: API routes are registered BEFORE frontend catch-all");
  console.log("=".repeat(70) + "\n");
  console.log("🎯 Server ready! Waiting for requests...\n");
});
