const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("usuarios.db");

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    rol TEXT,
    activo INTEGER
  )
`);

module.exports = db;


