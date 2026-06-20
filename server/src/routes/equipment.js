const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const router   = express.Router();

// GET /api/equipment?status=
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let q = `SELECT e.*, p.name AS project_name FROM equipment e
      LEFT JOIN projects p ON e.project_id=p.id WHERE 1=1`;
    const params = [];
    if (status) { q += ' AND e.status=$1'; params.push(status); }
    q += ' ORDER BY e.name';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/equipment
router.post('/', auth, restrict('admin'), async (req, res) => {
  try {
    const { name, type, model, serial_number, purchase_date, purchase_value, status, project_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO equipment (name, type, model, serial_number, purchase_date, purchase_value, status, project_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, type, model, serial_number, purchase_date||null, purchase_value||null, status||'Available', project_id||null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/equipment/:id  (includes maintenance logs)
router.get('/:id', auth, async (req, res) => {
  try {
    const [eq, logs] = await Promise.all([
      pool.query(`SELECT e.*, p.name AS project_name FROM equipment e
        LEFT JOIN projects p ON e.project_id=p.id WHERE e.id=$1`, [req.params.id]),
      pool.query(`SELECT m.*, u.name AS logged_by_name FROM maintenance_logs m
        JOIN users u ON m.logged_by=u.id WHERE m.equipment_id=$1
        ORDER BY m.maintenance_date DESC`, [req.params.id]),
    ]);
    if (!eq.rows.length) return res.status(404).json({ message: 'Equipment not found' });
    res.json({ ...eq.rows[0], maintenance_logs: logs.rows });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/equipment/:id
router.put('/:id', auth, restrict('admin'), async (req, res) => {
  try {
    const { name, type, model, status, project_id } = req.body;
    const { rows } = await pool.query(
      `UPDATE equipment SET name=$1, type=$2, model=$3, status=$4, project_id=$5 WHERE id=$6 RETURNING *`,
      [name, type, model, status, project_id||null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Equipment not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/equipment/:id/maintenance
router.post('/:id/maintenance', auth, restrict('admin','manager'), async (req, res) => {
  try {
    const { maintenance_date, description, cost, next_service_date } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO maintenance_logs (equipment_id, maintenance_date, description, cost, next_service_date, logged_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.params.id, maintenance_date, description, cost||0, next_service_date||null, req.user.id]
    );
    // Mark equipment as under maintenance
    await pool.query("UPDATE equipment SET status='Under Maintenance' WHERE id=$1", [req.params.id]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/equipment/:id
router.delete('/:id', auth, restrict('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM equipment WHERE id=$1', [req.params.id]);
    res.json({ message: 'Equipment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
