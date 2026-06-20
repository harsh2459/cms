const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const router   = express.Router();

// GET /api/settings
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM settings LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/settings
router.put('/', auth, restrict('admin'), async (req, res) => {
  try {
    const { company_name, timezone, currency, currency_symbol } = req.body;
    const { rows } = await pool.query(
      `UPDATE settings SET
        company_name=COALESCE($1,company_name),
        timezone=COALESCE($2,timezone),
        currency=COALESCE($3,currency),
        currency_symbol=COALESCE($4,currency_symbol),
        updated_at=NOW()
       WHERE id=1 RETURNING *`,
      [company_name, timezone, currency, currency_symbol]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
