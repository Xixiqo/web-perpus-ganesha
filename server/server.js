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
