const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const { getEstimate } = require('../utils/grok');
const router   = express.Router();

// GET /api/estimator — list past estimates (admin sees all, others see own)
router.get('/', auth, async (req, res) => {
  try {
    let query = `SELECT id, title, description, estimated_cost, estimated_days, status, error_message, created_by, created_at
                  FROM project_estimates`;
    const params = [];
    if (req.user.role !== 'admin') {
      query += ` WHERE created_by = $1`;
      params.push(req.user.id);
    }
    query += ` ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/estimator/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM project_estimates WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Estimate not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/estimator/estimate
router.post('/estimate', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'title and description are required' });
    }

    try {
      const { parsed, raw } = await getEstimate(description);
      const { rows } = await pool.query(
        `INSERT INTO project_estimates
           (title, description, estimated_cost, estimated_days, materials_json, labor_json, summary, raw_response, status, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'completed',$9) RETURNING *`,
        [
          title, description, parsed.estimated_cost, parsed.estimated_days,
          JSON.stringify(parsed.materials), JSON.stringify(parsed.labor),
          parsed.summary, JSON.stringify(raw), req.user.id,
        ]
      );
      res.status(201).json(rows[0]);
    } catch (aiErr) {
      const { rows } = await pool.query(
        `INSERT INTO project_estimates (title, description, status, error_message, created_by)
         VALUES ($1,$2,'failed',$3,$4) RETURNING *`,
        [title, description, aiErr.message, req.user.id]
      );
      res.status(502).json({ message: aiErr.message, estimate: rows[0] });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/estimator/:id — save edited materials/labor, server recalculates total cost
router.put('/:id', auth, async (req, res) => {
  try {
    const { materials, labor } = req.body;
    if (!Array.isArray(materials) || !Array.isArray(labor)) {
      return res.status(400).json({ message: 'materials and labor must be arrays' });
    }

    const materialsTotal = materials.reduce((sum, m) => sum + (Number(m.quantity) * Number(m.unit_price)), 0);
    const laborTotal = labor.reduce((sum, l) => sum + (Number(l.count) * Number(l.duration_days) * Number(l.daily_wage)), 0);
    const estimatedCost = materialsTotal + laborTotal;

    const normalizedMaterials = materials.map(m => ({
      ...m,
      total_cost: Number(m.quantity) * Number(m.unit_price),
    }));
    const normalizedLabor = labor.map(l => ({
      ...l,
      total_cost: Number(l.count) * Number(l.duration_days) * Number(l.daily_wage),
    }));

    const { rows } = await pool.query(
      `UPDATE project_estimates
       SET materials_json=$1, labor_json=$2, estimated_cost=$3
       WHERE id=$4 RETURNING *`,
      [JSON.stringify(normalizedMaterials), JSON.stringify(normalizedLabor), estimatedCost, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Estimate not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/estimator/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT created_by FROM project_estimates WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Estimate not found' });
    if (req.user.role !== 'admin' && rows[0].created_by !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this estimate' });
    }
    await pool.query('DELETE FROM project_estimates WHERE id=$1', [req.params.id]);
    res.json({ message: 'Estimate deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/estimator/:id/convert
router.post('/:id/convert', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT * FROM project_estimates WHERE id=$1', [req.params.id]);
    if (!rows.length) throw new Error('Estimate not found');
    const estimate = rows[0];

    const estimatedDays = estimate.estimated_days || 30;
    const materials = estimate.materials_json || [];
    const labor = estimate.labor_json || [];

    // Create Project
    const projectRes = await client.query(
      `INSERT INTO projects (name, location, total_budget, start_date, end_date, status, description, manager_id, created_by)
       VALUES ($1, 'Estimated Location', $2, CURRENT_DATE, CURRENT_DATE + $3::INTERVAL, 'Planning', $4, $5, $5) RETURNING id`,
      [estimate.title, estimate.estimated_cost, `${estimatedDays} days`, estimate.description, req.user.id]
    );
    const projectId = projectRes.rows[0].id;

    // Create Materials
    for (const m of materials) {
      if (!m.name) continue;
      await client.query(
        `INSERT INTO materials (name, unit, price_per_unit, qty_available, project_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [m.name, m.unit || 'units', m.unit_price || 0, m.quantity || 0, projectId]
      );
    }

    // Create Workers (Labor)
    for (const l of labor) {
      if (!l.role) continue;
      const count = Number(l.count) || 1;
      for (let i = 1; i <= count; i++) {
        await client.query(
          `INSERT INTO workers (name, skill, daily_wage, worker_type, wage_type, project_id)
           VALUES ($1, $2, $3, 'Local Daily', 'Daily', $4)`,
          [`${l.role} ${i}`, l.role, l.daily_wage || 0, projectId]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ project_id: projectId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
