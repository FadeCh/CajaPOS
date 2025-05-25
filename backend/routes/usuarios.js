const express = require("express");
const router = express.Router();
const db = require("../dbUsuarios");

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  try {
    const row = db.prepare("SELECT * FROM usuarios WHERE username = ? AND password = ? AND activo = 1")
                 .get(username, password);

    if (!row) {
      return res.status(401).json({ error: "Credenciales inválidas o usuario desactivado" });
    }

    res.json({ username: row.username, rol: row.rol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear usuario (solo superadmin)
router.post("/crear", (req, res) => {
  const { username, password, rol } = req.body;
  try {
    const result = db.prepare(
      "INSERT INTO usuarios (username, password, rol, activo) VALUES (?, ?, ?, 1)"
    ).run(username, password, rol);

    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Desactivar usuario
router.put("/desactivar/:username", (req, res) => {
  const { username } = req.params;
  try {
    db.prepare("UPDATE usuarios SET activo = 0 WHERE username = ?").run(username);
    res.json({ message: "Usuario desactivado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete("/eliminar/:username", (req, res) => {
  const { username } = req.params;
  try {
    db.prepare("DELETE FROM usuarios WHERE username = ?").run(username);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar usuarios (solo uno de estos dos endpoints debe quedar)
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT id, username, rol, activo FROM usuarios").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;