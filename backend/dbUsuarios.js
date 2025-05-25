const db = require('./db');

// Crear tabla si no existe (solo la primera vez)
db.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    rol TEXT,
    activo BOOLEAN
  )
`).then(() => {
  console.log("Tabla 'usuarios' verificada");
}).catch(err => {
  console.error("Error creando/verificando tabla usuarios:", err);
});

module.exports = db;
