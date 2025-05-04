const express = require("express");
const router = express.Router();
const db = require("../db"); // Asegúrate de tener db.js configurado con SQLite o el motor que usas

// Obtener todos los productos
router.get("/", (req, res) => {
  db.all("SELECT * FROM productos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Agregar producto
router.post("/", (req, res) => {
  const { nombre, precio, categoria } = req.body;
  if (!nombre || !precio || !categoria)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  const query = "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)";
  db.run(query, [nombre, precio, categoria], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Editar producto
router.put("/:id", (req, res) => {
  const { nombre, precio, categoria } = req.body;
  const { id } = req.params;

  const query = "UPDATE productos SET nombre = ?, precio = ?, categoria = ? WHERE id = ?";
  db.run(query, [nombre, precio, categoria, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Eliminar producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM productos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
