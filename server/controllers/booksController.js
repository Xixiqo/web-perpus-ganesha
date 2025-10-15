import db from "../config/db.js";

export const getBooks = (req, res) => {
  const query = "SELECT id, judul, pembuat, kategori, stok, cover FROM books";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};
