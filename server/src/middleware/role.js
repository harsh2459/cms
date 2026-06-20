// Role-based access control middleware
// Usage: restrict('admin') or restrict('admin', 'manager')
const restrict = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Access denied: insufficient role' });
  next();
};

module.exports = restrict;
