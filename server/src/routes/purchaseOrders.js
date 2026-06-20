const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const { generatePONumber, notifyAdmins } = require('../utils/helpers');
const router   = express.Router();

// GET /api/purchase-orders?project_id=&status=
router.get('/', auth, projectAuth('purchase_order'), async (req, res) => {
  try {
    const { project_id, status } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    let q = `SELECT po.*, s.name AS supplier_name, u1.name AS created_by_name, u2.name AS approved_by_name
      FROM purchase_orders po
      JOIN suppliers s ON po.supplier_id=s.id
      JOIN users u1 ON po.created_by=u1.id
      LEFT JOIN users u2 ON po.approved_by=u2.id
      WHERE po.project_id=$1`;
    const params = [project_id];
    if (status) { q += ' AND po.status=$2'; params.push(status); }
    q += ' ORDER BY po.created_at DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/purchase-orders — create with items
router.post('/', auth, restrict('admin', 'manager'), projectAuth('purchase_order'), async (req, res) => {
  try {
    const { supplier_id, project_id, expected_delivery, tax_percent, notes, items } = req.body;

    if (!supplier_id) return res.status(400).json({ message: 'Supplier is required' });
    if (!project_id)  return res.status(400).json({ message: 'Project ID is required' });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const po_number = await generatePONumber();
      // Calculate totals
      const validItems = (items || []).filter(it => it.description && it.description.trim());
      const subtotal = validItems.reduce((sum, it) => sum + ((parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0)), 0);
      const taxPct = parseFloat(tax_percent) || 18;
      const grand_total = subtotal * (1 + taxPct / 100);

      // Sanitize: empty string → null for optional fields
      const deliveryVal = expected_delivery && expected_delivery.trim() ? expected_delivery.trim() : null;
      const notesVal    = notes && notes.trim() ? notes.trim() : null;

      const po = await client.query(
        `INSERT INTO purchase_orders (po_number, supplier_id, project_id, expected_delivery, subtotal, tax_percent, grand_total, notes, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [po_number, supplier_id, project_id, deliveryVal, subtotal, taxPct, grand_total, notesVal, req.user.id]
      );
      const poId = po.rows[0].id;

      // Insert line items
      for (const item of validItems) {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unit_price) || 0;
        const total = qty * price;
        await client.query(
          `INSERT INTO po_items (po_id, description, quantity, unit, unit_price, total_price)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [poId, item.description.trim(), qty, item.unit || '', price, total]
        );
      }
      await client.query('COMMIT');
      // Notify admins
      await notifyAdmins('purchase_order', `New PO ${po_number} created for ₹${grand_total.toFixed(0)}`, project_id);
      res.status(201).json({ ...po.rows[0], items });
    } catch (e) {
      await client.query('ROLLBACK'); throw e;
    } finally { client.release(); }
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/purchase-orders/:id — edit draft PO with items
router.put('/:id', auth, restrict('admin', 'manager'), projectAuth('purchase_order'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { supplier_id, expected_delivery, tax_percent, notes, items } = req.body;

    if (!supplier_id) {
      client.release();
      return res.status(400).json({ message: 'Supplier is required' });
    }

    await client.query('BEGIN');
    const validItems = (items || []).filter(it => it.description && it.description.trim());
    const subtotal = validItems.reduce((sum, it) => sum + ((parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0)), 0);
    const taxPct = parseFloat(tax_percent) || 18;
    const grand_total = subtotal * (1 + taxPct / 100);
    const deliveryVal = expected_delivery && expected_delivery.trim() ? expected_delivery.trim() : null;
    const notesVal    = notes && notes.trim() ? notes.trim() : null;
    const po = await client.query(
      `UPDATE purchase_orders SET supplier_id=$1, expected_delivery=$2, subtotal=$3,
       tax_percent=$4, grand_total=$5, notes=$6
       WHERE id=$7 AND status='Draft' RETURNING *`,
      [supplier_id, deliveryVal, subtotal, taxPct, grand_total, notesVal, req.params.id]
    );
    if (!po.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Only draft purchase orders can be edited' });
    }
    await client.query('DELETE FROM po_items WHERE po_id=$1', [req.params.id]);
    for (const item of validItems) {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      await client.query(
        `INSERT INTO po_items (po_id, description, quantity, unit, unit_price, total_price)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [req.params.id, item.description.trim(), qty, item.unit || '', price, qty * price]
      );
    }
    await client.query('COMMIT');
    res.json({ ...po.rows[0], items: validItems });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally { client.release(); }
});

// GET /api/purchase-orders/:id  with items
router.get('/:id', auth, projectAuth('purchase_order'), async (req, res) => {
  try {
    const [po, items] = await Promise.all([
      pool.query(`SELECT po.*, s.name AS supplier_name, s.phone AS supplier_phone,
        u1.name AS created_by_name, u2.name AS approved_by_name
        FROM purchase_orders po
        JOIN suppliers s ON po.supplier_id=s.id
        JOIN users u1 ON po.created_by=u1.id
        LEFT JOIN users u2 ON po.approved_by=u2.id
        WHERE po.id=$1`, [req.params.id]),
      pool.query('SELECT * FROM po_items WHERE po_id=$1 ORDER BY id', [req.params.id]),
    ]);
    if (!po.rows.length) return res.status(404).json({ message: 'PO not found' });
    res.json({ ...po.rows[0], items: items.rows });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/purchase-orders/:id/approve
router.patch('/:id/approve', auth, restrict('admin', 'manager'), projectAuth('purchase_order'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE purchase_orders SET status='Approved', approved_by=$1, approved_at=NOW()
       WHERE id=$2 AND status='Draft' RETURNING *`,
      [req.user.id, req.params.id]
    );
    if (!rows.length) return res.status(400).json({ message: 'PO not in Draft status' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/purchase-orders/:id/reject
router.patch('/:id/reject', auth, restrict('admin', 'manager'), projectAuth('purchase_order'), async (req, res) => {
  try {
    const { notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE purchase_orders SET status='Closed', rejection_notes=$1 WHERE id=$2 RETURNING *`,
      [notes, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'PO not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/purchase-orders/:id/deliver
router.patch('/:id/deliver', auth, restrict('admin','manager'), projectAuth('purchase_order'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE purchase_orders SET status='Delivered' WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'PO not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/purchase-orders/:id
router.delete('/:id', auth, restrict('admin'), projectAuth('purchase_order'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM purchase_orders WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'PO not found' });
    res.json({ message: 'PO deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
