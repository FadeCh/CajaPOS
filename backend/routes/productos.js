const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar producto
router.post("/", async (req, res) => {
  const { nombre, precio, categoria } = req.body;
  if (!nombre || !precio || !categoria)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  try {
    const result = await db.query(
      "INSERT INTO productos (nombre, precio, categoria) VALUES ($1, $2, $3) RETURNING id",
      [nombre, precio, categoria]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar producto
router.put("/:id", async (req, res) => {
  const { nombre, precio, categoria } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE productos SET nombre = $1, precio = $2, categoria = $3 WHERE id = $4",
      [nombre, precio, categoria, id]
    );
    res.json({ updated: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM productos WHERE id = $1", [id]);
    res.json({ deleted: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
