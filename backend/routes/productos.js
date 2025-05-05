const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los productos
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM productos").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar producto
router.post("/", (req, res) => {
  const { nombre, precio, categoria } = req.body;
  if (!nombre || !precio || !categoria)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  try {
    const stmt = db.prepare("INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)");
    const result = stmt.run(nombre, precio, categoria);
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar producto
router.put("/:id", (req, res) => {
  const { nombre, precio, categoria } = req.body;
  const { id } = req.params;

  try {
    const stmt = db.prepare("UPDATE productos SET nombre = ?, precio = ?, categoria = ? WHERE id = ?");
    const result = stmt.run(nombre, precio, categoria, id);
    res.json({ updated: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare("DELETE FROM productos WHERE id = ?");
    const result = stmt.run(id);
    res.json({ deleted: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
