const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const { sendBudgetAlert } = require('../utils/email');
const { notifyAdmins }    = require('../utils/helpers');
const router   = express.Router();

// GET /api/expenses?project_id=&category=
router.get('/', auth, projectAuth('expense'), async (req, res) => {
  try {
    const { project_id, category } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    let q = `SELECT e.*, u.name AS added_by_name FROM expenses e
      JOIN users u ON e.added_by=u.id WHERE e.project_id=$1`;
    const params = [project_id];
    if (category) { q += ' AND e.category=$2'; params.push(category); }
    q += ' ORDER BY e.expense_date DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/expenses
router.post('/', auth, restrict('admin','manager'), projectAuth('expense'), async (req, res) => {
  try {
    const { category, amount, description, expense_date, project_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO expenses (category, amount, description, expense_date, project_id, added_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [category, amount, description, expense_date, project_id, req.user.id]
    );

    // Budget alert check — notify if > 80%
    const [proj, total_spent] = await Promise.all([
      pool.query('SELECT total_budget, name FROM projects WHERE id=$1', [project_id]),
      pool.query('SELECT SUM(amount) AS total FROM expenses WHERE project_id=$1', [project_id]),
    ]);
    const budget = parseFloat(proj.rows[0]?.total_budget || 0);
    const spent  = parseFloat(total_spent.rows[0]?.total || 0);
    const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
    if (pct >= 80) {
      await notifyAdmins('budget', `Budget alert: ${proj.rows[0]?.name} has reached ${pct}% of total budget.`, project_id);
    }

    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/expenses/:id
router.put('/:id', auth, restrict('admin','manager'), projectAuth('expense'), async (req, res) => {
  try {
    const { category, amount, description, expense_date } = req.body;
    if (!(Number(amount) > 0)) return res.status(400).json({ message: 'Amount must be greater than zero' });
    const { rows } = await pool.query(
      `UPDATE expenses SET category=$1, amount=$2, description=$3, expense_date=$4
       WHERE id=$5 RETURNING *`,
      [category, amount, description, expense_date, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Expense not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/expenses/:id
router.delete('/:id', auth, restrict('admin'), projectAuth('expense'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM expenses WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/expenses/summary?project_id=  — by category
router.get('/summary', auth, projectAuth('expense'), async (req, res) => {
  try {
    const { project_id } = req.query;
    const { rows } = await pool.query(
      'SELECT category, SUM(amount) AS total FROM expenses WHERE project_id=$1 GROUP BY category',
      [project_id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
