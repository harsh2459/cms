const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const router   = express.Router();

// GET /api/logs?project_id=&from=&to=
router.get('/', auth, projectAuth('log'), async (req, res) => {
  try {
    const { project_id, from, to } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    let q = `SELECT l.*, u.name AS logged_by_name FROM daily_logs l
      JOIN users u ON l.logged_by=u.id WHERE l.project_id=$1`;
    const params = [project_id];
    let i = 2;
    if (from) { q += ` AND l.log_date >= $${i++}`; params.push(from); }
    if (to)   { q += ` AND l.log_date <= $${i++}`; params.push(to); }
    q += ' ORDER BY l.log_date DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/logs
router.post('/', auth, restrict('admin','manager'), projectAuth('log'), async (req, res) => {
  try {
    const { log_date, work_done, workers_present, materials_used, weather_delay, notes, project_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO daily_logs (log_date, work_done, workers_present, materials_used, weather_delay, notes, project_id, logged_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [log_date, work_done, workers_present||0, materials_used, weather_delay||false, notes, project_id, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/logs/:id
router.put('/:id', auth, restrict('admin','manager'), projectAuth('log'), async (req, res) => {
  try {
    const { log_date, work_done, workers_present, materials_used, weather_delay, notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE daily_logs SET log_date=COALESCE($1,log_date), work_done=$2, workers_present=$3, materials_used=$4,
       weather_delay=$5, notes=$6 WHERE id=$7 RETURNING *`,
      [log_date, work_done, workers_present, materials_used, weather_delay, notes, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Log not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/logs/:id
router.delete('/:id', auth, restrict('admin'), projectAuth('log'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM daily_logs WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
