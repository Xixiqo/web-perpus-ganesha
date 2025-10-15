import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import db from "./db.js"; // ✅ pastikan file db.js juga pakai export default

// __dirname tidak tersedia di ESM, jadi kita buat manual:
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env dari folder server/api
dotenv.config({ path: path.join(__dirname, "server", "api", ".env") });

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server Web Perpus Ganesha aktif 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
