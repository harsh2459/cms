const pool = require('../db/pool');

// Create a notification for a user
const createNotification = async (userId, type, message, projectId = null) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, type, message, project_id) VALUES ($1,$2,$3,$4)',
      [userId, type, message, projectId]
    );
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

// Notify all admins
const notifyAdmins = async (type, message, projectId = null) => {
  try {
    const { rows } = await pool.query("SELECT id FROM users WHERE role='admin' AND is_active=TRUE");
    for (const admin of rows) {
      await createNotification(admin.id, type, message, projectId);
    }
  } catch (err) {
    console.error('notifyAdmins error:', err.message);
  }
};

// Auto PO number generator: PO-2026-0001
const generatePONumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;
  const startPos = prefix.length + 1; // PostgreSQL SUBSTRING is 1-based
  const { rows } = await pool.query(
    `SELECT COALESCE(MAX(
       CAST(NULLIF(REGEXP_REPLACE(SUBSTRING(po_number, ${startPos}), '[^0-9]', '', 'g'), '') AS INTEGER)
     ), 0) + 1 AS next_num
     FROM purchase_orders
     WHERE po_number LIKE $1`,
    [`${prefix}%`]
  );
  return `${prefix}${String(rows[0].next_num).padStart(4, '0')}`;
};

module.exports = { createNotification, notifyAdmins, generatePONumber };
