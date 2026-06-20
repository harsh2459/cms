const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const router   = express.Router();

// GET /api/materials?project_id=
router.get('/', auth, projectAuth('material'), async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    const { rows } = await pool.query(
      'SELECT * FROM materials WHERE project_id=$1 ORDER BY name', [project_id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/materials/transactions?project_id=&material_id=
router.get('/transactions', auth, projectAuth('material'), async (req, res) => {
  try {
    const { project_id, material_id } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    let q = `
      SELECT t.*, m.name AS material_name, m.unit, u.name AS performed_by_name
      FROM material_transactions t
      JOIN materials m ON t.material_id = m.id
      JOIN users u ON t.performed_by = u.id
      WHERE t.project_id = $1
    `;
    const params = [project_id];
    if (material_id) { q += ` AND t.material_id = $2`; params.push(material_id); }
    q += ' ORDER BY t.transaction_date DESC, t.created_at DESC LIMIT 200';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/materials
router.post('/', auth, restrict('admin','manager'), projectAuth('material'), async (req, res) => {
  try {
    const { name, unit, qty_available, qty_used, price_per_unit, low_stock_threshold, supplier_name, supplier_phone, project_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO materials (name,unit,qty_available,qty_used,price_per_unit,low_stock_threshold,supplier_name,supplier_phone,project_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, unit, qty_available||0, qty_used||0, price_per_unit, low_stock_threshold||10, supplier_name, supplier_phone, project_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/materials/:id
router.put('/:id', auth, restrict('admin','manager'), projectAuth('material'), async (req, res) => {
  try {
    const { name, unit, qty_available, qty_used, price_per_unit, low_stock_threshold, supplier_name } = req.body;
    const { rows } = await pool.query(
      `UPDATE materials SET name=$1,unit=$2,qty_available=$3,qty_used=$4,price_per_unit=$5,
       low_stock_threshold=$6,supplier_name=$7 WHERE id=$8 RETURNING *`,
      [name, unit, qty_available, qty_used, price_per_unit, low_stock_threshold, supplier_name, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Material not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/materials/:id/use — deduct stock and log transaction
router.patch('/:id/use', auth, projectAuth('material'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { qty, notes, invoice_number, transaction_date } = req.body;
    if (Number(qty) <= 0) return res.status(400).json({ message: 'Quantity must be positive' });

    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE materials
       SET qty_available = qty_available - $1,
           qty_used      = qty_used + $1
       WHERE id=$2 AND qty_available >= $1
       RETURNING *`,
      [qty, req.params.id]
    );
    if (!rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient stock or material not found' });
    }

    await client.query(
      `INSERT INTO material_transactions
         (material_id, project_id, type, quantity, invoice_number, notes, performed_by, transaction_date)
       VALUES ($1,$2,'use',$3,$4,$5,$6,$7)`,
      [req.params.id, rows[0].project_id, qty, invoice_number||null, notes||null, req.user.id, transaction_date||new Date().toISOString().split('T')[0]]
    );

    await client.query('COMMIT');
    res.json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally { client.release(); }
});

// PATCH /api/materials/:id/restock — add stock and log transaction
router.patch('/:id/restock', auth, restrict('admin','manager'), projectAuth('material'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { qty, notes, invoice_number, invoice_url, transaction_date } = req.body;
    if (Number(qty) <= 0) return res.status(400).json({ message: 'Quantity must be positive' });

    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE materials SET qty_available = qty_available + $1 WHERE id=$2 RETURNING *`,
      [qty, req.params.id]
    );
    if (!rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Material not found' });
    }

    await client.query(
      `INSERT INTO material_transactions
         (material_id, project_id, type, quantity, invoice_number, invoice_url, notes, performed_by, transaction_date)
       VALUES ($1,$2,'restock',$3,$4,$5,$6,$7,$8)`,
      [req.params.id, rows[0].project_id, qty, invoice_number||null, invoice_url||null, notes||null, req.user.id, transaction_date||new Date().toISOString().split('T')[0]]
    );

    await client.query('COMMIT');
    res.json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally { client.release(); }
});

// DELETE /api/materials/:id
router.delete('/:id', auth, restrict('admin'), projectAuth('material'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM materials WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
