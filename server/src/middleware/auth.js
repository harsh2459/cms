const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = (auth && auth.startsWith('Bearer '))
      ? auth.split(' ')[1]
      : req.query.token;
    if (!token)
      return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await pool.query('SELECT id, name, email, role, is_active FROM users WHERE id=$1', [decoded.id]);
    if (!rows.length || !rows[0].is_active)
      return res.status(401).json({ message: 'User not found or deactivated' });

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
