const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const router   = express.Router();

// GET /api/tasks/my-tasks
router.get('/my-tasks', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, p.name AS project_name,
               CASE WHEN t.assigned_to IS NOT NULL THEN w.name
                    WHEN t.assigned_user_id IS NOT NULL THEN u.name
                    ELSE NULL END AS assigned_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN workers w ON t.assigned_to = w.id
       LEFT JOIN users u ON t.assigned_user_id = u.id
       WHERE t.assigned_user_id=$1 OR w.user_id=$1
       ORDER BY
         CASE t.status WHEN 'In Progress' THEN 1 WHEN 'Pending' THEN 2 ELSE 3 END,
         t.deadline ASC NULLS LAST,
         t.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/tasks/:id/my-status
router.patch('/:id/my-status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Verify the task is actually assigned to this user (via worker record or direct assignment)
    const workerRes = await pool.query('SELECT id FROM workers WHERE user_id=$1', [req.user.id]);
    const workerId = workerRes.rows[0]?.id || null;

    const { rows } = await pool.query(
      `UPDATE tasks SET
         status = $1,
         completed_at = CASE WHEN $1 = 'Done' THEN NOW() ELSE NULL END
       WHERE id = $2::uuid
         AND (assigned_user_id = $3 OR ($4::uuid IS NOT NULL AND assigned_to = $4::uuid))
       RETURNING *`,
      [status, req.params.id, req.user.id, workerId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Task not found or not assigned to you' });
    res.json(rows[0]);
  } catch (err) {
    console.error('my-status error:', err.message, err.stack);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks?project_id=&status=&phase=&assigned_to=
router.get('/', auth, projectAuth('task'), async (req, res) => {
  try {
    const { project_id, status, phase, assigned_to } = req.query;
    let q = `SELECT t.*, p.name AS project_name,
               CASE WHEN t.assigned_to IS NOT NULL THEN w.name
                    WHEN t.assigned_user_id IS NOT NULL THEN u.name
                    ELSE NULL END AS assigned_name
             FROM tasks t
             LEFT JOIN projects p ON t.project_id = p.id
             LEFT JOIN workers w ON t.assigned_to = w.id
             LEFT JOIN users u ON t.assigned_user_id = u.id
             WHERE 1=1`;
    const params = [];
    let i = 1;

    // Enforce manager isolation if no project_id provided
    if (req.user.role === 'manager') {
      q += ` AND t.project_id IN (SELECT id FROM projects WHERE manager_id=$${i++})`;
      params.push(req.user.id);
    }

    if (project_id) { q += ` AND t.project_id=$${i++}`; params.push(project_id); }
    if (status)     { q += ` AND t.status=$${i++}`;     params.push(status); }
    if (phase)      { q += ` AND t.phase=$${i++}`;      params.push(phase); }
    if (assigned_to){ 
      q += ` AND (t.assigned_to=$${i} OR t.assigned_user_id=$${i})`; 
      params.push(assigned_to); 
      i++;
    }
    q += ' ORDER BY t.created_at DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/tasks
router.post('/', auth, restrict('admin','manager'), async (req, res) => {
  try {
    const { title, description, phase, status, priority, deadline, assigned_to, assigned_user_id, project_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, phase, status, priority, deadline, assigned_to, assigned_user_id, project_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, description, phase, status||'Pending', priority||'Medium', deadline||null, assigned_to||null, assigned_user_id||null, project_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/tasks/:id
router.get('/:id', auth, projectAuth('task'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*,
               CASE WHEN t.assigned_to IS NOT NULL THEN w.name
                    WHEN t.assigned_user_id IS NOT NULL THEN u.name
                    ELSE NULL END AS assigned_name
       FROM tasks t
       LEFT JOIN workers w ON t.assigned_to = w.id
       LEFT JOIN users u ON t.assigned_user_id = u.id
       WHERE t.id=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Task not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/tasks/:id
router.put('/:id', auth, projectAuth('task'), async (req, res) => {
  try {
    const { title, description, phase, status, priority, deadline, assigned_to, assigned_user_id } = req.body;
    // Sentinel '__keep__' means "field not sent — keep DB value". null means "explicitly clear".
    const deadlineParam = deadline === undefined ? '__keep__'
      : (deadline === null || deadline === '' ? null : deadline);

    // '__keep__' = field not sent, preserve DB value; null = explicitly clear; uuid string = set
    const assignedToParam      = assigned_to      === undefined ? '__keep__' : (assigned_to      === null || assigned_to      === '' ? null : String(assigned_to));
    const assignedUserIdParam  = assigned_user_id === undefined ? '__keep__' : (assigned_user_id === null || assigned_user_id === '' ? null : String(assigned_user_id));

    const { rows } = await pool.query(
      `UPDATE tasks SET
       title       = COALESCE($1, title),
       description = COALESCE($2, description),
       phase       = COALESCE($3, phase),
       status      = COALESCE($4, status),
       priority    = COALESCE($5, priority),
       deadline    = CASE WHEN $6::text = '__keep__' THEN deadline ELSE $6::date END,
       assigned_to      = CASE WHEN $7 IS NOT DISTINCT FROM '__keep__' THEN assigned_to      ELSE $7::uuid END,
       assigned_user_id = CASE WHEN $8 IS NOT DISTINCT FROM '__keep__' THEN assigned_user_id ELSE $8::uuid END,
       completed_at = CASE WHEN $4::text = 'Done' THEN NOW() WHEN $4 IS NOT NULL THEN NULL ELSE completed_at END
       WHERE id = $9 RETURNING *`,
      [
        title ?? null,
        description ?? null,
        phase ?? null,
        status ?? null,
        priority ?? null,
        deadlineParam,
        assignedToParam,
        assignedUserIdParam,
        req.params.id
      ]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/tasks/:id
router.delete('/:id', auth, restrict('admin','manager'), projectAuth('task'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
