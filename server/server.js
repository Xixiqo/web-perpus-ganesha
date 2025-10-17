import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";

// ============================================
// 🧩 SETUP ENVIRONMENT
// ============================================
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

// ============================================
// 📦 EXPRESS APP SETUP
// ============================================
const app = express();

// CORS configuration
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || "*", 
  credentials: true 
}));

// Body parser
app.use(express.json());

// Logging middleware - tambahkan log lebih detail
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static files untuk upload (cover buku, dll)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================
// 📥 IMPORT API ROUTES
// ============================================

// === PUBLIC/USER ROUTES ===
import authRoutes from "./api/auth.js";
import profileRoutes from "./api/profile.js";
import booksRoutes from "./api/books.js";
import searchRoutes from "./api/search.js";
import peminjamanRoutes from "./api/riwayat.js";
import categoriesRoutes from "./api/categories.js";

// === ADMIN ROUTES (versi baru dengan double 'n') ===
import adminPeminjamannRoutes from "./api/admin/peminjamann.js";
import adminPengembaliannRoutes from "./api/admin/pengembaliann.js";

// === ADMIN ROUTES (versi lama - single 'n') ===
import adminPeminjamanRoutes from "./api/admin/peminjaman.js";
import adminPengembalianRoutes from "./api/admin/pengembalian.js";
import adminUsersRoutes from "./api/admin/users.js"
import ProcessPeminjamanRoutes from "./api/peminjaman.js"

// === ADMIN ROUTES (lainnya) ===
import adminBooksRoutes from "./api/admin/books.js";
import adminUsersRoutes from "./api/admin/users.js";

console.log("✅ All route modules imported successfully");

// ============================================
// 🛣️ REGISTER API ROUTES
// ============================================
// ⚠️ CRITICAL: API routes HARUS didaftarkan SEBELUM frontend static files

console.log("📝 Registering API routes...");

// === ADMIN ROUTES - NEW (dengan double 'n') ===
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
console.log("   ✓ Registered: /api/auth");

app.use("/api/profile", profileRoutes);
console.log("   ✓ Registered: /api/profile");

app.use("/api/books", booksRoutes);
console.log("   ✓ Registered: /api/books");

app.use("/api/search", searchRoutes);
console.log("   ✓ Registered: /api/search");

app.use("/api/riwayat", peminjamanRoutes);
console.log("   ✓ Registered: /api/riwayat");

app.use("/api/categories", categoriesRoutes);
console.log("   ✓ Registered: /api/categories");

console.log("✅ All API routes registered\n");

// ============================================
// 🌐 FRONTEND HANDLER (Vue Build)
// ============================================
// ⚠️ CRITICAL: INI HARUS PALING BAWAH - setelah SEMUA API routes

const frontendPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(frontendPath)) {
  console.log("📁 Frontend build folder found:", frontendPath);
  
  // Serve static files dari Vue build (CSS, JS, images)
  app.use(express.static(frontendPath));
  console.log("   ✓ Static files served from:", frontendPath);

  // ⚠️ CATCH-ALL ROUTE - HARUS PALING AKHIR
  // Ini akan menangkap SEMUA request yang tidak match dengan route di atas
  app.get("*", (req, res) => {
    // Jangan tangkap request API
    if (req.url.startsWith('/api/')) {
      return res.status(404).json({ 
        error: 'API endpoint not found',
        path: req.url 
      });
    }
    
    // Untuk request non-API, kirim index.html (Vue Router akan handle)
    console.log("   → Serving index.html for:", req.url);
    res.sendFile(path.join(frontendPath, "index.html"));
  });
  
  console.log("   ✓ Vue Router catch-all registered");
} else {
  console.warn("⚠️ Frontend build folder NOT found:", frontendPath);
  console.warn("   Please run: cd frontend && npm run build");
}
app.use("/api/peminjaman", ProcessPeminjamanRoutes);

// // === FRONTEND HANDLER (penting!) ===
// // Arahkan ke folder build Vue (frontend/dist)
// const frontendPath = path.join(__dirname, "../frontend/dist");
// if (fs.existsSync(frontendPath)) {
//   app.use(express.static(frontendPath));

//   // Handle semua route frontend ke index.html
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// } else {
//   console.warn("⚠️ Frontend build folder not found:", frontendPath);
// }

// ============================================
// 🚀 START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("\n" + "=".repeat(70));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}/`);
  console.log("=".repeat(70));
  console.log("📡 API Endpoints available:");
  console.log("");
  console.log("   PUBLIC ROUTES:");
  console.log("   - POST   /api/auth/login");
  console.log("   - POST   /api/auth/register");
  console.log("   - GET    /api/books");
  console.log("   - GET    /api/categories");
  console.log("   - GET    /api/search");
  console.log("   - GET    /api/riwayat");
  console.log("   - GET    /api/profile");
  console.log("");
  console.log("   ADMIN ROUTES (NEW - double n):");
  console.log("   - GET    /api/admin/peminjamann");
  console.log("   - GET    /api/admin/peminjamann/check/late  ⭐");
  console.log("   - GET    /api/admin/peminjamann/:id");
  console.log("   - PUT    /api/admin/peminjamann/:id/status");
  console.log("   - PUT    /api/admin/peminjamann/:id/return");
  console.log("   - DELETE /api/admin/peminjamann/:id");
  console.log("   - GET    /api/admin/pengembaliann");
  console.log("   - GET    /api/admin/pengembaliann/stats/summary");
  console.log("   - GET    /api/admin/pengembaliann/peminjaman/:id");
  console.log("");
  console.log("   ADMIN ROUTES (OLD - single n):");
  console.log("   - GET    /api/admin/peminjaman");
  console.log("   - GET    /api/admin/pengembalian");
  console.log("");
  console.log("   ADMIN ROUTES (OTHER):");
  console.log("   - GET    /api/admin/users");
  console.log("   - GET    /api/admin/books");
  console.log("=".repeat(70));
  console.log("⚠️  IMPORTANT: API routes are registered BEFORE frontend catch-all");
  console.log("=".repeat(70) + "\n");
  console.log("🎯 Server ready! Waiting for requests...\n");
});