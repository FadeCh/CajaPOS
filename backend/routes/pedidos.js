const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  try {
    const { items, total } = req.body;
    const fecha = new Date().toISOString();

    const result = await db.query(
      "INSERT INTO pedidos (items, total, fecha) VALUES ($1, $2, $3) RETURNING id",
      [JSON.stringify(items), total, fecha]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM pedidos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
