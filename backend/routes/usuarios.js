const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM usuarios ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nuevo usuario
router.post("/", async (req, res) => {
  const { username, password, rol, activo } = req.body;
  if (!username || !password || !rol)
    return res.status(400).json({ error: "Faltan datos obligatorios" });

  try {
    const result = await db.query(
      "INSERT INTO usuarios (username, password, rol, activo) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, password, rol, activo ?? 1]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  const { username, password, rol, activo } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE usuarios SET username = $1, password = $2, rol = $3, activo = $4 WHERE id = $5",
      [username, password, rol, activo, id]
    );
    res.json({ updated: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.json({ deleted: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
