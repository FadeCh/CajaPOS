const Database = require('better-sqlite3');
const db = new Database('./pedidos.db', { verbose: console.log }); // misma base de datos para todo

// Crear tabla pedidos
db.prepare(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT,
    total INTEGER,
    fecha TEXT
  )
`).run();

// Crear tabla productos
db.prepare(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio INTEGER NOT NULL,
    categoria TEXT NOT NULL
  )
`).run();

module.exports = db;
