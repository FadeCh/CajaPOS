const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./pedidos.db"); // misma base de datos para todo

// Crear tabla pedidos
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT,
    total INTEGER,
    fecha TEXT
  )`);

  // ✅ Crear tabla productos
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio INTEGER NOT NULL,
    categoria TEXT NOT NULL
  )`);
});

module.exports = db;
