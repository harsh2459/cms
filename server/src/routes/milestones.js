const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const router = express.Router();

// GET /api/milestones?project_id=
router.get('/', auth, projectAuth('milestone'), async (req, res) => {
  try {
    const { project_id } = req.query;
    let query = `SELECT * FROM milestones WHERE 1=1`;
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
    query += ` ORDER BY target_date ASC`;
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/milestones
router.post('/', auth, restrict('admin', 'manager'), projectAuth('milestone'), async (req, res) => {
  try {
    const { project_id, title, description, target_date } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO milestones (project_id, title, description, target_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [project_id, title, description, target_date]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/milestones/:id
router.put('/:id', auth, restrict('admin', 'manager'), projectAuth('milestone'), async (req, res) => {
  try {
    const { title, description, target_date, status, completed_date } = req.body;
    const { rows } = await pool.query(
      `UPDATE milestones 
       SET title=$1, description=$2, target_date=$3, status=$4, completed_date=$5 
       WHERE id=$6 RETURNING *`,
      [title, description || null, target_date || null, status, completed_date || null, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Milestone not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/milestones/:id
router.delete('/:id', auth, restrict('admin', 'manager'), projectAuth('milestone'), async (req, res) => {
  try {
    const { rowCount } = await pool.query(`DELETE FROM milestones WHERE id=$1`, [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ message: 'Milestone deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
