const express  = require('express');
const bcrypt   = require('bcryptjs');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const router   = express.Router();

// GET /api/users  (Admin only)
router.get('/', auth, restrict('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/users — Admin creates user
router.post('/', auth, restrict('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields required' });
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, is_active',
      [name, email, hash, role]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/users/:id — Update role / active status / password
router.put('/:id', auth, restrict('admin'), async (req, res) => {
  try {
    const { role, is_active, name, password } = req.body;
    let pwdUpdate = '';
    let args = [role, is_active, name, req.params.id];
    
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      args.push(hash);
      pwdUpdate = `, password_hash=$5`;
    }

    const { rows } = await pool.query(
      `UPDATE users SET
        role=COALESCE($1,role),
        is_active=COALESCE($2,is_active),
        name=COALESCE($3,name)
        ${pwdUpdate}
       WHERE id=$4
       RETURNING id, name, email, role, is_active`,
      args
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/users/me/change-password — Self password change
router.patch('/me/change-password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });

    const hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/users/me — Current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, is_active, created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
// DELETE /api/users/:id — Admin deletes user
router.delete('/:id', auth, restrict('admin'), async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.params.id;

    if (req.user.id === parseInt(userId, 10)) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    const exists = await client.query('SELECT id FROM users WHERE id=$1', [userId]);
    if (!exists.rows.length) return res.status(404).json({ message: 'User not found' });

    await client.query('BEGIN');

    // Null out all nullable FK columns that reference this user
    await client.query('UPDATE projects          SET manager_id   = NULL WHERE manager_id   = $1', [userId]);
    await client.query('UPDATE workers           SET user_id      = NULL WHERE user_id      = $1', [userId]);
    await client.query('UPDATE tasks             SET assigned_user_id = NULL WHERE assigned_user_id = $1', [userId]);
    await client.query('UPDATE tasks             SET assigned_to  = NULL WHERE assigned_to  = $1', [userId]);
    await client.query('UPDATE purchase_orders   SET approved_by  = NULL WHERE approved_by  = $1', [userId]);
    await client.query('UPDATE project_estimates SET created_by   = NULL WHERE created_by   = $1', [userId]);
    await client.query('UPDATE material_catalog  SET created_by   = NULL WHERE created_by   = $1', [userId]);
    await client.query('UPDATE project_ai_summaries SET generated_by = NULL WHERE generated_by = $1', [userId]);
    await client.query('UPDATE worker_ai_reviews    SET generated_by = NULL WHERE generated_by = $1', [userId]);

    // Delete notifications (user_id is NOT NULL so cannot be nulled — safe to delete)
    await client.query('DELETE FROM notifications WHERE user_id = $1', [userId]);

    // Attempt the actual user delete
    const { rowCount } = await client.query('DELETE FROM users WHERE id=$1', [userId]);
    if (rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'User not found' });
    }

    await client.query('COMMIT');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    // FK violation means user has created records (issues, logs, materials, etc.) that cannot be orphaned
    if (err.code === '23503') {
      return res.status(409).json({
        message: 'This user has created project records (issues, logs, expenses, etc.) and cannot be deleted. Deactivate the account instead.'
      });
    }
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
