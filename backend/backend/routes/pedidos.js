const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pedidos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/", (req, res) => {
  try {
    const { items, total } = req.body;
    const fecha = new Date().toISOString();

    const stmt = db.prepare("INSERT INTO pedidos (items, total, fecha) VALUES (?, ?, ?)");
    const result = stmt.run(JSON.stringify(items), total, fecha);

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
