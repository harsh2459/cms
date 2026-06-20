const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const { analyzeWorker } = require('../utils/grok');
const router = express.Router();

// GET /api/workers  — query ?project_id= &limit= &offset=
router.get('/', auth, projectAuth('worker'), async (req, res) => {
  try {
    const { project_id, limit, offset } = req.query;
    let query = `SELECT w.*, p.name AS project_name FROM workers w
      LEFT JOIN projects p ON w.project_id=p.id WHERE 1=1`;
    const params = [];
    let i = 1;

    // Enforce manager isolation if no project_id provided
    if (req.user.role === 'manager') {
      query += ` AND w.project_id IN (SELECT id FROM projects WHERE manager_id=$${i++})`;
      params.push(req.user.id);
    }

    if (project_id) { query += ` AND w.project_id=$${i++}`; params.push(project_id); }
    query += ' ORDER BY w.name';
    if (limit) { query += ` LIMIT $${i++}`; params.push(Number(limit)); }
    if (offset) { query += ` OFFSET $${i++}`; params.push(Number(offset)); }
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/workers
router.post('/', auth, restrict('admin', 'manager'), projectAuth('worker'), async (req, res) => {
  try {
    const { name, skill, daily_wage, phone, project_id, worker_type, wage_type, user_id } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO workers (name, skill, daily_wage, phone, project_id, worker_type, wage_type, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [name, skill, daily_wage, phone, project_id, worker_type || 'Core', wage_type || 'Monthly', user_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/unlinked-users — worker-role users not yet linked to a worker record
router.get('/unlinked-users', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email FROM users u
       WHERE u.role='worker' AND u.is_active=TRUE
       AND u.id NOT IN (SELECT user_id FROM workers WHERE user_id IS NOT NULL)
       ORDER BY u.name`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/me — resolve the logged-in worker's own worker record
router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT w.*, p.name AS project_name FROM workers w
       LEFT JOIN projects p ON w.project_id=p.id WHERE w.user_id=$1`,
      [req.user.id]
    );
    res.json(rows[0] || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/me/dashboard — stats + recent attendance for the logged-in worker
router.get('/me/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const workerRes = await pool.query('SELECT id FROM workers WHERE user_id=$1', [userId]);
    const workerId = workerRes.rows[0]?.id || null;

    // Count tasks assigned via worker record OR directly via user account
    const workerClause = workerId
      ? `(assigned_to=$1 OR assigned_user_id=$2)`
      : `assigned_user_id=$2`;
    const taskParams = workerId ? [workerId, userId] : [null, userId];

    const [pending, done, monthPresent, recentAttendance] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM tasks WHERE ${workerClause} AND status!='Done'`, taskParams),
      pool.query(`SELECT COUNT(*) FROM tasks WHERE ${workerClause} AND status='Done'`, taskParams),
      workerId
        ? pool.query(
            `SELECT COUNT(*) FROM attendance WHERE worker_id=$1 AND status='Present' AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)`,
            [workerId]
          )
        : Promise.resolve({ rows: [{ count: '0' }] }),
      workerId
        ? pool.query(`SELECT date, status FROM attendance WHERE worker_id=$1 ORDER BY date DESC LIMIT 5`, [workerId])
        : Promise.resolve({ rows: [] }),
    ]);

    res.json({
      stats: {
        pendingTasks: parseInt(pending.rows[0].count),
        tasksDone: parseInt(done.rows[0].count),
        daysPresent: parseInt(monthPresent.rows[0].count),
      },
      recentAttendance: recentAttendance.rows,
      hasWorkerProfile: !!workerId,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/payroll
router.get('/payroll', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().substring(0, 7);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const type = req.query.type || 'All';

    let baseQuery = `FROM workers w
      LEFT JOIN projects p ON w.project_id = p.id
      LEFT JOIN attendance a ON w.id = a.worker_id AND TO_CHAR(a.date, 'YYYY-MM') = $1
      LEFT JOIN payroll_payments pp ON w.id = pp.worker_id AND pp.month = $1
      WHERE 1=1`;
    const params = [month];

    if (req.user.role === 'manager') {
      params.push(req.user.id);
      baseQuery += ` AND p.manager_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      baseQuery += ` AND w.name ILIKE $${params.length}`;
    }

    if (type !== 'All') {
      params.push(type);
      baseQuery += ` AND w.worker_type = $${params.length}`;
    }

    // Count total rows
    const countQuery = `SELECT COUNT(DISTINCT w.id) ${baseQuery}`;
    const { rows: countRows } = await pool.query(countQuery, params);
    const total = parseInt(countRows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT w.*, p.name AS project_name,
        COUNT(a.id) FILTER (WHERE a.status = 'Present') AS present_days,
        COUNT(a.id) FILTER (WHERE a.status = 'Half Day') AS half_days,
        COUNT(a.id) FILTER (WHERE a.status = 'Absent') AS absent_days,
        COALESCE(MAX(pp.amount_paid), 0) AS amount_paid
      ${baseQuery}
      GROUP BY w.id, p.name
      ORDER BY w.name
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const { rows } = await pool.query(dataQuery, [...params, limit, offset]);

    // Calculate Grand Totals across all matches
    const allDataQuery = `
      SELECT w.daily_wage, w.wage_type,
        COUNT(a.id) FILTER (WHERE a.status = 'Present') AS present_days,
        COUNT(a.id) FILTER (WHERE a.status = 'Half Day') AS half_days,
        COUNT(a.id) FILTER (WHERE a.status = 'Absent') AS absent_days,
        COALESCE(MAX(pp.amount_paid), 0) AS amount_paid
      ${baseQuery}
      GROUP BY w.id
    `;
    const { rows: allRows } = await pool.query(allDataQuery, params);

    let totalEstimated = 0;
    let totalPaid = 0;

    const [yr, mo] = month.split('-').map(Number);
    const daysInMonth = new Date(yr, mo, 0).getDate();

    allRows.forEach(w => {
      totalPaid += Number(w.amount_paid);
      const present = Number(w.present_days) || 0;
      const half    = Number(w.half_days)    || 0;
      const rate    = Number(w.daily_wage)   || 0;

      if (w.wage_type === 'Monthly') {
        const dailyEquivalent = rate / daysInMonth;
        const paidDays = present + (half * 0.5);
        totalEstimated += Math.max(0, paidDays * dailyEquivalent);
      } else {
        totalEstimated += (present * rate) + (half * (rate / 2));
      }
    });

    res.json({ data: rows, total, totalEstimated, totalPaid });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/workers/payroll/pay
router.post('/payroll/pay', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const { worker_id, month, amount, payment_method, payment_id } = req.body;
    await pool.query(
      `INSERT INTO payroll_payments (worker_id, month, amount_paid, payment_method, payment_id) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (worker_id, month) 
       DO UPDATE SET amount_paid = payroll_payments.amount_paid + $3,
                     payment_method = $4,
                     payment_id = COALESCE($5, payroll_payments.payment_id)`,
      [worker_id, month, amount, payment_method || 'Cash', payment_id || null]
    );
    res.json({ message: 'Payment recorded successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/:id
router.get('/:id', auth, projectAuth('worker'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT w.*, p.name AS project_name,
        (SELECT COUNT(*) FROM attendance WHERE worker_id=w.id AND status='Present') AS present_days,
        (SELECT COUNT(*) FROM attendance WHERE worker_id=w.id AND status='Absent')  AS absent_days,
        (SELECT COUNT(*) FROM attendance WHERE worker_id=w.id AND status='Half Day') AS half_days
       FROM workers w LEFT JOIN projects p ON w.project_id=p.id WHERE w.id=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Worker not found' });
    const worker = rows[0];

    const tasks = await pool.query(
      `SELECT * FROM tasks WHERE assigned_to=$1 ORDER BY created_at DESC LIMIT 10`,
      [req.params.id]
    );
    const certs = await pool.query(
      `SELECT * FROM worker_certifications WHERE worker_id=$1 ORDER BY expiry_date ASC`,
      [req.params.id]
    );
    res.json({ ...worker, tasks: tasks.rows, certifications: certs.rows });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/workers/:id
router.put('/:id', auth, restrict('admin', 'manager'), projectAuth('worker'), async (req, res) => {
  try {
    const { name, skill, daily_wage, phone, project_id, worker_type, wage_type, user_id } = req.body;
    const { rows } = await pool.query(
      'UPDATE workers SET name=$1, skill=$2, daily_wage=$3, phone=$4, project_id=$5, worker_type=$6, wage_type=$7, user_id=$8 WHERE id=$9 RETURNING *',
      [name, skill, daily_wage, phone, project_id, worker_type, wage_type, user_id || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Worker not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/workers/:id
router.delete('/:id', auth, restrict('admin'), projectAuth('worker'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM workers WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/:id/ai-review — latest cached review (if any)
router.get('/:id/ai-review', auth, restrict('admin', 'manager'), projectAuth('worker'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM worker_ai_reviews WHERE worker_id=$1 ORDER BY created_at DESC LIMIT 1`,
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/workers/:id/ai-review — generate a fresh AI performance review
router.post('/:id/ai-review', auth, restrict('admin', 'manager'), projectAuth('worker'), async (req, res) => {
  try {
    const id = req.params.id;
    const worker = await pool.query(
      `SELECT w.*,
        (SELECT COUNT(*) FROM attendance WHERE worker_id=w.id AND status='Present') AS present_days,
        (SELECT COUNT(*) FROM attendance WHERE worker_id=w.id AND status='Absent')  AS absent_days,
        (SELECT COUNT(*) FROM attendance WHERE worker_id=w.id AND status='Half Day') AS half_days
       FROM workers w WHERE w.id=$1`,
      [id]
    );
    if (!worker.rows.length) return res.status(404).json({ message: 'Worker not found' });
    const w = worker.rows[0];
    const presentDays = Number(w.present_days);
    const absentDays = Number(w.absent_days);
    const halfDays = Number(w.half_days);

    const tasks = await pool.query(
      `SELECT title, status, deadline, completed_at FROM tasks WHERE assigned_to=$1 ORDER BY created_at DESC LIMIT 30`,
      [id]
    );

    const tasksTotal = tasks.rows.length;
    const tasksDone = tasks.rows.filter(t => t.status === 'Done').length;
    const tasksOverdue = tasks.rows.filter(t => t.status !== 'Done' && t.deadline && new Date(t.deadline) < new Date()).length;
    const totalDays = presentDays + absentDays + halfDays;

    const snapshot = {
      name: w.name,
      skill: w.skill,
      worker_type: w.worker_type,
      attendance: {
        present_days: presentDays,
        absent_days: absentDays,
        half_days: halfDays,
        total_recorded_days: totalDays,
        attendance_rate_percent: totalDays > 0 ? Math.round(((presentDays + halfDays * 0.5) / totalDays) * 100) : null,
      },
      tasks: {
        total_assigned: tasksTotal,
        completed: tasksDone,
        overdue: tasksOverdue,
        completion_rate_percent: tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : null,
        recent_tasks: tasks.rows.slice(0, 10),
      },
    };

    try {
      const review = await analyzeWorker(snapshot);
      const { rows } = await pool.query(
        `INSERT INTO worker_ai_reviews (worker_id, rating, summary, strengths, concerns, recommendations, generated_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [id, review.rating, review.summary, JSON.stringify(review.strengths), JSON.stringify(review.concerns), JSON.stringify(review.recommendations), req.user.id]
      );
      res.status(201).json(rows[0]);
    } catch (aiErr) {
      res.status(502).json({ message: aiErr.message });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
});
// POST /api/workers/:id/certifications — add a certification for a worker
router.post('/:id/certifications', auth, restrict('admin', 'manager'), projectAuth('worker'), async (req, res) => {
  try {
    const { name, issue_date, expiry_date, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO worker_certifications (worker_id, name, issue_date, expiry_date, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.params.id, name, issue_date || null, expiry_date || null, status || 'Active']
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;