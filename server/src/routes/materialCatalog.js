const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const router   = express.Router();

// GET /api/material-catalog
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM material_catalog ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/material-catalog
router.post('/', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const { name, unit, unit_price } = req.body;
    if (!name || !unit) return res.status(400).json({ message: 'name and unit are required' });
    const { rows } = await pool.query(
      `INSERT INTO material_catalog (name, unit, unit_price, created_by)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (name) DO UPDATE SET unit=$2, unit_price=$3
       RETURNING *`,
      [name, unit, unit_price || 0, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/material-catalog/:id
router.put('/:id', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const { name, unit, unit_price } = req.body;
    const { rows } = await pool.query(
      `UPDATE material_catalog SET name=$1, unit=$2, unit_price=$3 WHERE id=$4 RETURNING *`,
      [name, unit, unit_price, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Material not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/material-catalog/:id
router.delete('/:id', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    await pool.query('DELETE FROM material_catalog WHERE id=$1', [req.params.id]);
    res.json({ message: 'Material removed from catalog' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
