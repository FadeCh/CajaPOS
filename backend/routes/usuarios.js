// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const db = require("../dbUsuarios");

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE username = ? AND password = ? AND activo = 1";
  db.get(query, [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: "Credenciales inválidas o usuario desactivado" });
    res.json({ username: row.username, rol: row.rol });
  });
});

// Crear usuario (solo superadmin)
router.post("/crear", (req, res) => {
  const { username, password, rol } = req.body;
  const query = "INSERT INTO usuarios (username, password, rol, activo) VALUES (?, ?, ?, 1)";
  db.run(query, [username, password, rol], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Desactivar usuario
router.put("/desactivar/:username", (req, res) => {
  const { username } = req.params;
  const query = "UPDATE usuarios SET activo = 0 WHERE username = ?";
  db.run(query, [username], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario desactivado" });
  });
});

// Eliminar usuario
router.delete("/eliminar/:username", (req, res) => {
  const { username } = req.params;
  const query = "DELETE FROM usuarios WHERE username = ?";
  db.run(query, [username], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario eliminado" });
  });
});

// Listar usuarios activos
router.get("/", (req, res) => {
  const query = "SELECT username, rol, activo FROM usuarios";
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener todos los usuarios
router.get("/", (req, res) => {
    const query = "SELECT id, username, rol, activo FROM usuarios";
    db.all(query, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  
  




module.exports = router;