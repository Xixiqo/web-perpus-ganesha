// server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// 🧩 Load .env file
dotenv.config();

console.log("Loaded ENV:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "****" : "(empty)",
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});

// Setup __dirname karena kita pakai module system
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ==== AUTH ROUTE ====
import authRoutes from "./api/auth.js";
app.use("/api/auth", authRoutes);

// ==== PROFILE ROUTE ==== ✨ TAMBAHKAN INI
import profileRoutes from "./api/profile.js";
app.use("/api/profile", profileRoutes);

// ==== CATEGORIES ROUTE ====
app.get("/api/categories", (req, res) => {
  const filePath = path.join(__dirname, "api/categories.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

import booksRoutes from "./api/books.js";
app.use("/api/books", booksRoutes);
// ==== Jalankan server ====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});