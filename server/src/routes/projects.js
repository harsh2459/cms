const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const { sendBudgetAlert } = require('../utils/email');
const { notifyAdmins }    = require('../utils/helpers');
const { analyzeProject }  = require('../utils/grok');
const projectAuth = require('../middleware/projectAuth');
const router   = express.Router();

// GET /api/projects  — Admin: all, Manager: assigned
router.get('/', auth, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'admin') {
      query  = `SELECT p.*, u.name AS manager_name,
        (SELECT COUNT(*) FROM workers WHERE project_id=p.id) AS workers_count,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) AS tasks_total,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done') AS tasks_done,
        (SELECT COALESCE(SUM(amount),0) FROM expenses WHERE project_id=p.id) AS spent,
        (SELECT COUNT(*) FROM issues WHERE project_id=p.id AND status!='Resolved') AS open_issues,
        ROUND(
          CASE WHEN (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) = 0 THEN 0
          ELSE (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done')::NUMERIC /
               (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) * 100 END
        ) AS progress
        FROM projects p LEFT JOIN users u ON p.manager_id=u.id
        WHERE p.is_deleted=FALSE ORDER BY p.created_at DESC`;
      params = [];
    } else {
      query  = `SELECT p.*, u.name AS manager_name,
        ROUND(
          CASE WHEN (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) = 0 THEN 0
          ELSE (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done')::NUMERIC /
               (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) * 100 END
        ) AS progress
        FROM projects p
        LEFT JOIN users u ON p.manager_id=u.id
        WHERE p.manager_id=$1 AND p.is_deleted=FALSE ORDER BY p.created_at DESC`;
      params = [req.user.id];
    }
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects
router.post('/', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const { name, location, total_budget, start_date, end_date, status, description, manager_id } = req.body;
    let finalManagerId = manager_id || null;
    if (req.user.role === 'manager') {
      finalManagerId = req.user.id;
    }
    const { rows } = await pool.query(
      `INSERT INTO projects (name, location, total_budget, start_date, end_date, status, description, manager_id, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, location, total_budget || null, start_date || null, end_date || null, status || 'Planning', description, finalManagerId, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id
router.get('/:id', auth, projectAuth('project'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, u.name AS manager_name,
        (SELECT COUNT(*) FROM workers WHERE project_id=p.id) AS workers_count,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) AS tasks_total,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done') AS tasks_done,
        (SELECT COALESCE(SUM(amount),0) FROM expenses WHERE project_id=p.id) AS spent,
        (SELECT COUNT(*) FROM issues WHERE project_id=p.id AND status!='Resolved') AS open_issues,
        ROUND(
          CASE WHEN (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) = 0 THEN 0
          ELSE (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done')::NUMERIC /
               (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) * 100 END
        ) AS progress
       FROM projects p LEFT JOIN users u ON p.manager_id=u.id
       WHERE p.id=$1 AND p.is_deleted=FALSE`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Project not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/projects/:id
router.put('/:id', auth, restrict('admin'), async (req, res) => {
  try {
    const { name, location, total_budget, start_date, end_date, status, description, manager_id } = req.body;
    const { rowCount, rows } = await pool.query(
      `UPDATE projects SET name=$1, location=$2, total_budget=$3, start_date=$4,
       end_date=$5, status=$6, description=$7, manager_id=$8 WHERE id=$9 AND is_deleted=FALSE RETURNING *`,
      [name, location, total_budget || null, start_date || null, end_date || null, status, description, manager_id || null, req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Project not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/projects/:id (soft delete)
router.delete('/:id', auth, restrict('admin'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('UPDATE projects SET is_deleted=TRUE WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id/workers
router.get('/:id/workers', auth, projectAuth('project'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM workers WHERE project_id=$1 ORDER BY name', [req.params.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id/tasks
router.get('/:id/tasks', auth, projectAuth('project'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*,
         CASE WHEN t.assigned_to IS NOT NULL THEN w.name
              WHEN t.assigned_user_id IS NOT NULL THEN u.name
              ELSE NULL END AS assigned_name
       FROM tasks t
       LEFT JOIN workers w ON t.assigned_to = w.id
       LEFT JOIN users u ON t.assigned_user_id = u.id
       WHERE t.project_id=$1 ORDER BY t.created_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id/budget
router.get('/:id/budget', auth, projectAuth('project'), async (req, res) => {
  try {
    const [proj, exp] = await Promise.all([
      pool.query('SELECT total_budget FROM projects WHERE id=$1', [req.params.id]),
      pool.query('SELECT COALESCE(SUM(amount),0) AS spent FROM expenses WHERE project_id=$1', [req.params.id]),
    ]);
    const total = parseFloat(proj.rows[0]?.total_budget || 0);
    const spent = parseFloat(exp.rows[0]?.spent || 0);
    res.json({ total, spent, remaining: total - spent, percent: total > 0 ? Math.round((spent/total)*100) : 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id/report — full data for PDF
router.get('/:id/report', auth, restrict('admin'), projectAuth('project'), async (req, res) => {
  try {
    const id = req.params.id;
    const [proj, tasks, expenses, issues, workers] = await Promise.all([
      pool.query(`SELECT p.*, u.name AS manager_name,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) AS tasks_total,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done') AS tasks_done,
        (SELECT COALESCE(SUM(amount),0) FROM expenses WHERE project_id=p.id) AS spent,
        (SELECT COUNT(*) FROM workers WHERE project_id=p.id) AS workers_count,
        (SELECT COUNT(*) FROM issues WHERE project_id=p.id AND status!='Resolved') AS open_issues
        FROM projects p LEFT JOIN users u ON p.manager_id=u.id WHERE p.id=$1`, [id]),
      pool.query("SELECT * FROM tasks WHERE project_id=$1", [id]),
      pool.query("SELECT category, SUM(amount) AS total FROM expenses WHERE project_id=$1 GROUP BY category", [id]),
      pool.query("SELECT * FROM issues WHERE project_id=$1 ORDER BY created_at DESC LIMIT 10", [id]),
      pool.query("SELECT * FROM workers WHERE project_id=$1", [id]),
    ]);
    if (!proj.rows.length) return res.status(404).json({ message: 'Project not found' });
    const project = proj.rows[0];
    const spent = parseFloat(project.spent);
    res.json({
      project,
      kpis: { progress: project.tasks_total > 0 ? Math.round(project.tasks_done/project.tasks_total*100) : 0, spent, workers: project.workers_count, tasks_done: project.tasks_done, tasks_total: project.tasks_total, open_issues: project.open_issues },
      expenses_by_category: expenses.rows,
      recent_issues: issues.rows,
      tasks: tasks.rows,
      workers: workers.rows,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id/ai-summary — latest cached summary (if any)
router.get('/:id/ai-summary', auth, projectAuth('project'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM project_ai_summaries WHERE project_id=$1 ORDER BY created_at DESC LIMIT 1`,
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects/:id/ai-summary — generate a fresh AI analysis
router.post('/:id/ai-summary', auth, projectAuth('project'), async (req, res) => {
  try {
    const id = req.params.id;
    const [proj, expenses, issues] = await Promise.all([
      pool.query(`SELECT p.*,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) AS tasks_total,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done') AS tasks_done,
        (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='In Progress') AS tasks_in_progress,
        (SELECT COALESCE(SUM(amount),0) FROM expenses WHERE project_id=p.id) AS spent,
        (SELECT COUNT(*) FROM workers WHERE project_id=p.id) AS workers_count,
        (SELECT COUNT(*) FROM issues WHERE project_id=p.id AND status!='Resolved') AS open_issues,
        (SELECT COUNT(*) FROM issues WHERE project_id=p.id AND priority='Critical' AND status!='Resolved') AS critical_issues
        FROM projects p WHERE p.id=$1 AND p.is_deleted=FALSE`, [id]),
      pool.query("SELECT category, SUM(amount) AS total FROM expenses WHERE project_id=$1 GROUP BY category", [id]),
      pool.query("SELECT title, priority, status FROM issues WHERE project_id=$1 AND status!='Resolved' ORDER BY created_at DESC LIMIT 10", [id]),
    ]);
    if (!proj.rows.length) return res.status(404).json({ message: 'Project not found' });
    const project = proj.rows[0];

    const snapshot = {
      name: project.name,
      status: project.status,
      start_date: project.start_date,
      end_date: project.end_date,
      total_budget: Number(project.total_budget),
      spent: Number(project.spent),
      budget_used_percent: project.total_budget > 0 ? Math.round((project.spent / project.total_budget) * 100) : 0,
      tasks_total: project.tasks_total,
      tasks_done: project.tasks_done,
      tasks_in_progress: project.tasks_in_progress,
      progress_percent: project.tasks_total > 0 ? Math.round((project.tasks_done / project.tasks_total) * 100) : 0,
      workers_count: project.workers_count,
      open_issues: project.open_issues,
      critical_issues: project.critical_issues,
      open_issues_detail: issues.rows,
      expenses_by_category: expenses.rows,
    };

    try {
      const analysis = await analyzeProject(snapshot);
      const { rows } = await pool.query(
        `INSERT INTO project_ai_summaries (project_id, summary, risks, recommendations, health, generated_by)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [id, analysis.summary, JSON.stringify(analysis.risks), JSON.stringify(analysis.recommendations), analysis.health, req.user.id]
      );
      res.status(201).json(rows[0]);
    } catch (aiErr) {
      res.status(502).json({ message: aiErr.message });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
