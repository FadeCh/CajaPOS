const Database = require('better-sqlite3');
const db = new Database('./usuarios.db', { verbose: console.log });

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    rol TEXT,
    activo INTEGER
  )
`).run();

module.exports = db;