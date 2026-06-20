const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const restrict = require('../middleware/role');
const router = express.Router();

// GET /api/audit
router.get('/', auth, restrict('admin'), async (req, res) => {
  try {
    const { project_id, limit = 50 } = req.query;
    let query = `
      SELECT a.*, u.name AS user_name, p.name AS project_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN projects p ON a.project_id = p.id
    `;
    const params = [];
    
    if (project_id) {
      query += ` WHERE a.project_id = $1`;
      params.push(project_id);
    }
    
    query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/audit (Internal / Manual logging if needed)
router.post('/', auth, async (req, res) => {
  try {
    const { project_id, action, entity_type, entity_id, details } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO audit_logs (user_id, project_id, action, entity_type, entity_id, details) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, project_id, action, entity_type, entity_id, details]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
