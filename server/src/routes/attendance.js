const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const router   = express.Router();

// GET /api/attendance?project_id=&month=&year=
router.get('/', auth, projectAuth('attendance'), async (req, res) => {
  try {
    const { project_id, month, year } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });

    let q = `SELECT a.*, w.name AS worker_name, w.skill, w.daily_wage
      FROM attendance a JOIN workers w ON a.worker_id=w.id
      WHERE a.project_id=$1`;
    const params = [project_id];
    if (month && year) {
      q += ` AND EXTRACT(MONTH FROM a.date)=$2 AND EXTRACT(YEAR FROM a.date)=$3`;
      params.push(month, year);
    }
    q += ' ORDER BY a.date, w.name';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/attendance — single
router.post('/', auth, restrict('admin','manager'), projectAuth('attendance'), async (req, res) => {
  try {
    const { worker_id, project_id, date, status, notes } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO attendance (worker_id, project_id, date, status, notes)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (worker_id, date)
       DO UPDATE SET status=EXCLUDED.status, notes=EXCLUDED.notes RETURNING *`,
      [worker_id, project_id, date, status, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/attendance/bulk
router.post('/bulk', auth, restrict('admin','manager'), async (req, res) => {
  try {
    const records = req.body; // array of { worker_id, project_id, date, status }
    if (!Array.isArray(records) || !records.length)
      return res.status(400).json({ message: 'Provide an array of attendance records' });

    if (req.user.role === 'manager') {
      const uniqueProjects = [...new Set(records.map(r => r.project_id))];
      for (let pid of uniqueProjects) {
        const pRes = await pool.query('SELECT manager_id FROM projects WHERE id=$1', [pid]);
        if (!pRes.rows.length || pRes.rows[0].manager_id !== req.user.id) {
          return res.status(403).json({ message: 'Forbidden: You do not manage all projects in this bulk request' });
        }
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const r of records) {
        await client.query(
          `INSERT INTO attendance (worker_id, project_id, date, status, notes)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT (worker_id, date)
           DO UPDATE SET status=EXCLUDED.status, notes=EXCLUDED.notes`,
          [r.worker_id, r.project_id, r.date, r.status, r.notes || null]
        );
      }
      await client.query('COMMIT');
      res.json({ message: `${records.length} attendance records saved` });
    } catch (e) {
      await client.query('ROLLBACK'); throw e;
    } finally { client.release(); }
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/attendance/summary/:worker_id?month=&year=
router.get('/summary/:worker_id', auth, async (req, res) => {
  try {
    if (req.user.role === 'worker') {
      const wRes = await pool.query('SELECT id FROM workers WHERE user_id=$1', [req.user.id]);
      if (!wRes.rows.length || wRes.rows[0].id !== req.params.worker_id) {
        return res.status(403).json({ message: 'Forbidden: You can only view your own attendance' });
      }
    }
    const { month, year } = req.query;
    const q = `
      SELECT
        COUNT(*) FILTER (WHERE status='Present')  AS present,
        COUNT(*) FILTER (WHERE status='Absent')   AS absent,
        COUNT(*) FILTER (WHERE status='Half Day') AS half_day,
        COUNT(*) AS total_days
      FROM attendance
      WHERE worker_id=$1
      ${month ? 'AND EXTRACT(MONTH FROM date)=$2' : ''}
      ${year  ? `AND EXTRACT(YEAR FROM date)=$${month ? 3 : 2}` : ''}
    `;
    const params = [req.params.worker_id];
    if (month) params.push(month);
    if (year)  params.push(year);
    const { rows } = await pool.query(q, params);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
