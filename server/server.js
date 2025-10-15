// server.js
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

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

import express from "express";
import cors from "cors";
import fs from "fs";

// === app setup ===
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json());

// Routes
import authRoutes from "./api/auth.js";
import profileRoutes from "./api/profile.js";

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/categories", (req, res) => {
  const filePath = path.join(__dirname, "api/categories.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
