const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "server", "api", ".env") }); // pastikan .env dibaca dari folder server/api

// Import koneksi database
const db = require("./db"); // ✅ ubah dari ./dbconn menjadi ./db

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Routes (kalau belum ada userRoutes, bisa kosong dulu)
app.get("/", (req, res) => {
  res.send("Server Web Perpus Ganesha aktif 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
