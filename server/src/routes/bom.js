const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const router = express.Router();

// GET /api/bom?project_id=
router.get('/', auth, projectAuth('bom'), async (req, res) => {
  try {
    const { project_id } = req.query;
    let query = `SELECT * FROM bill_of_materials WHERE 1=1`;
    const params = [];
    let i = 1;

    if (req.user.role === 'manager') {
      query += ` AND project_id IN (SELECT id FROM projects WHERE manager_id=$${i++})`;
      params.push(req.user.id);
    }

    if (project_id) {
      query += ` AND project_id = $${i++}`;
      params.push(project_id);
    }
    query += ` ORDER BY material_name ASC`;
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bom
router.post('/', auth, restrict('admin', 'manager'), projectAuth('bom'), async (req, res) => {
  try {
    const { project_id, material_name, unit, planned_qty, unit_price, notes } = req.body;
    if (Number(planned_qty) < 0) return res.status(400).json({ message: 'Quantity cannot be negative' });
    const { rows } = await pool.query(
      `INSERT INTO bill_of_materials (project_id, material_name, unit, planned_qty, unit_price, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [project_id, material_name, unit, planned_qty, unit_price, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bom/:id (for updating actual usage)
router.put('/:id', auth, restrict('admin', 'manager'), projectAuth('bom'), async (req, res) => {
  try {
    const { material_name, unit, planned_qty, actual_qty_used, unit_price, notes } = req.body;
    if (planned_qty !== undefined && Number(planned_qty) < 0) return res.status(400).json({ message: 'Quantity cannot be negative' });
    if (actual_qty_used !== undefined && Number(actual_qty_used) < 0) return res.status(400).json({ message: 'Quantity cannot be negative' });
    const { rows } = await pool.query(
      `UPDATE bill_of_materials 
       SET material_name=COALESCE($1,material_name), unit=COALESCE($2,unit),
       planned_qty=COALESCE($3,planned_qty), actual_qty_used=COALESCE($4,actual_qty_used),
       unit_price=COALESCE($5,unit_price), notes=COALESCE($6,notes)
       WHERE id=$7 RETURNING *`,
      [material_name, unit, planned_qty, actual_qty_used, unit_price, notes, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'BoM item not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bom/:id
router.delete('/:id', auth, restrict('admin', 'manager'), projectAuth('bom'), async (req, res) => {
  try {
    const { rowCount } = await pool.query(`DELETE FROM bill_of_materials WHERE id=$1`, [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'BoM item not found' });
    res.json({ message: 'BoM item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
