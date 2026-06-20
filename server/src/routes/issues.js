const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const { notifyAdmins, createNotification } = require('../utils/helpers');
const { sendCriticalIssue } = require('../utils/email');
const router   = express.Router();

// GET /api/issues?project_id=&status=&priority=
router.get('/', auth, projectAuth('issue'), async (req, res) => {
  try {
    const { project_id, status, priority } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    let q = `SELECT i.*, u1.name AS reported_by_name, u2.name AS assigned_to_name
      FROM issues i
      JOIN users u1 ON i.reported_by=u1.id
      LEFT JOIN users u2 ON i.assigned_to=u2.id
      WHERE i.project_id=$1`;
    const params = [project_id];
    let idx = 2;
    if (status)   { q += ` AND i.status=$${idx++}`;   params.push(status); }
    if (priority) { q += ` AND i.priority=$${idx++}`; params.push(priority); }
    q += ' ORDER BY i.created_at DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/issues
router.post('/', auth, restrict('admin','manager'), projectAuth('issue'), async (req, res) => {
  try {
    const { title, description, priority, project_id, assigned_to } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO issues (title, description, priority, project_id, reported_by, assigned_to)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, priority||'Medium', project_id, req.user.id, assigned_to||null]
    );
    // Notify admins if Critical
    if (priority === 'Critical') {
      const proj = await pool.query('SELECT name FROM projects WHERE id=$1', [project_id]);
      await notifyAdmins('issue', `🚨 Critical issue reported on ${proj.rows[0]?.name}: ${title}`, project_id);
    }
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/issues/:id
router.put('/:id', auth, restrict('admin','manager'), projectAuth('issue'), async (req, res) => {
  try {
    const { title, description, priority, status, assigned_to, resolution_notes } = req.body;
    const resolved_at = status === 'Resolved' ? new Date() : null;
    const { rows } = await pool.query(
      `UPDATE issues SET
        title=COALESCE($1,title), description=COALESCE($2,description),
        priority=COALESCE($3,priority), status=COALESCE($4,status),
        assigned_to=COALESCE($5,assigned_to),
        resolution_notes=COALESCE($6,resolution_notes),
        resolved_at=CASE WHEN $4='Resolved' THEN NOW() ELSE resolved_at END
       WHERE id=$7 RETURNING *`,
      [title, description, priority, status, assigned_to, resolution_notes, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Issue not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/issues/:id
router.delete('/:id', auth, restrict('admin'), projectAuth('issue'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM issues WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
