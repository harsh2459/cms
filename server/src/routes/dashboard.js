const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const router   = express.Router();

// GET /api/dashboard  — Full KPI data for admin/manager dashboard
router.get('/', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const projectFilter = isAdmin ? '' : `AND p.manager_id='${req.user.id}'`;

    const [
      projectsRes,
      workersRes,
      issuesRes,
      todayTasksRes,
      budgetRes,
      weekAttendanceRes,
      taskStatusRes,
      recentActivityRes,
    ] = await Promise.all([
      pool.query(`SELECT
        COUNT(*) AS total_projects,
        COUNT(*) FILTER (WHERE p.status='Ongoing') AS active_projects,
        COUNT(*) FILTER (WHERE p.status='Completed') AS completed_projects
        FROM projects p WHERE p.is_deleted=FALSE ${projectFilter}`),

      pool.query(`SELECT COUNT(*) AS total_workers FROM workers w
        JOIN projects p ON w.project_id=p.id WHERE p.is_deleted=FALSE ${projectFilter}`),

      pool.query(`SELECT COUNT(*) AS open_issues FROM issues i
        JOIN projects p ON i.project_id=p.id WHERE i.status!='Resolved' AND p.is_deleted=FALSE ${projectFilter}`),

      pool.query(`SELECT COUNT(*) AS tasks_completed_today FROM tasks t
        JOIN projects p ON t.project_id=p.id WHERE t.status='Done'
        AND DATE(t.completed_at)=CURRENT_DATE AND p.is_deleted=FALSE ${projectFilter}`),

      pool.query(`SELECT
        COALESCE(SUM(p.total_budget),0) AS total_budget,
        COALESCE(SUM(e.total),0) AS total_spent
        FROM projects p
        LEFT JOIN (SELECT project_id, SUM(amount) AS total FROM expenses GROUP BY project_id) e ON e.project_id=p.id
        WHERE p.is_deleted=FALSE ${projectFilter}`),

      pool.query(`
        SELECT TO_CHAR(a.date,'Dy') AS day, COUNT(DISTINCT a.worker_id) AS workers
        FROM attendance a
        JOIN projects p ON a.project_id=p.id
        WHERE a.date >= CURRENT_DATE - INTERVAL '6 days' AND a.status='Present' AND p.is_deleted=FALSE ${projectFilter}
        GROUP BY a.date, TO_CHAR(a.date,'Dy')
        ORDER BY a.date`),

      pool.query(`
        SELECT p.name, p.id,
          COUNT(t.id) FILTER (WHERE t.status='Done')        AS done,
          COUNT(t.id) FILTER (WHERE t.status='In Progress') AS inprogress,
          COUNT(t.id) FILTER (WHERE t.status='Pending')     AS pending
        FROM projects p LEFT JOIN tasks t ON t.project_id=p.id
        WHERE p.is_deleted=FALSE ${projectFilter}
        GROUP BY p.id LIMIT 8`),

      pool.query(`
        SELECT 'issue' AS type, i.title AS msg, i.created_at AS time, i.project_id
        FROM issues i JOIN projects p ON i.project_id=p.id WHERE p.is_deleted=FALSE ${projectFilter}
        UNION ALL
        SELECT 'log', l.work_done, l.created_at, l.project_id
        FROM daily_logs l JOIN projects p ON l.project_id=p.id WHERE p.is_deleted=FALSE ${projectFilter}
        ORDER BY time DESC LIMIT 10`),
    ]);

    const kpis = {
      totalProjects:       parseInt(projectsRes.rows[0].total_projects),
      activeProjects:      parseInt(projectsRes.rows[0].active_projects),
      completedProjects:   parseInt(projectsRes.rows[0].completed_projects),
      totalWorkers:        parseInt(workersRes.rows[0].total_workers),
      openIssues:          parseInt(issuesRes.rows[0].open_issues),
      tasksCompletedToday: parseInt(todayTasksRes.rows[0].tasks_completed_today),
      totalBudget:         parseFloat(budgetRes.rows[0].total_budget),
      totalSpent:          parseFloat(budgetRes.rows[0].total_spent),
    };

    // Projects with progress
    const projectsData = await pool.query(`
      SELECT p.*, u.name AS manager_name,
        ROUND(
          CASE WHEN (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) = 0 THEN 0
          ELSE (SELECT COUNT(*) FROM tasks WHERE project_id=p.id AND status='Done')::NUMERIC /
               (SELECT COUNT(*) FROM tasks WHERE project_id=p.id) * 100 END
        ) AS progress,
        (SELECT COALESCE(SUM(amount),0) FROM expenses WHERE project_id=p.id) AS spent
      FROM projects p LEFT JOIN users u ON p.manager_id=u.id
      WHERE p.is_deleted=FALSE ${projectFilter}
      ORDER BY p.created_at DESC LIMIT 10
    `);

    // Budget by project chart
    const budgetChart = projectsData.rows.map(p => ({
      name: p.name.split(' ')[0],
      budget: parseFloat(p.total_budget),
      spent: parseFloat(p.spent || 0),
    }));

    res.json({
      kpis,
      budgetChart,
      taskStatus: taskStatusRes.rows.map(r => ({
        name: r.name.split(' ')[0],
        done: parseInt(r.done), inprogress: parseInt(r.inprogress), pending: parseInt(r.pending),
      })),
      attendance: weekAttendanceRes.rows.map(r => ({ day: r.day, workers: parseInt(r.workers) })),
      projects: projectsData.rows,
      recentActivity: recentActivityRes.rows.map((r, i) => ({
        id: i + 1, type: r.type,
        msg: r.msg?.substring(0, 80),
        time: new Date(r.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
