const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const { generatePONumber } = require('../utils/helpers');
const router   = express.Router();

// GET /api/suppliers
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM suppliers ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/suppliers
router.post('/', auth, restrict('admin'), async (req, res) => {
  try {
    const { name, contact_person, phone, email, gst_number, payment_terms, address } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO suppliers (name, contact_person, phone, email, gst_number, payment_terms, address, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, contact_person, phone, email, gst_number, payment_terms, address, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/suppliers/:id
router.put('/:id', auth, restrict('admin'), async (req, res) => {
  try {
    const { name, contact_person, phone, email, gst_number, payment_terms, address } = req.body;
    const { rows } = await pool.query(
      `UPDATE suppliers SET name=$1, contact_person=$2, phone=$3, email=$4,
       gst_number=$5, payment_terms=$6, address=$7 WHERE id=$8 RETURNING *`,
      [name, contact_person, phone, email, gst_number, payment_terms, address, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Supplier not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/suppliers/:id
router.delete('/:id', auth, restrict('admin'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM suppliers WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
