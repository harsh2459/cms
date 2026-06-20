require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

// ─── Middleware ────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.ngrok-free\.(app|dev)$/.test(new URL(origin).hostname)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/projects',       require('./routes/projects'));
app.use('/api/workers',        require('./routes/workers'));
app.use('/api/attendance',     require('./routes/attendance'));
app.use('/api/tasks',          require('./routes/tasks'));
app.use('/api/materials',      require('./routes/materials'));
app.use('/api/expenses',       require('./routes/expenses'));
app.use('/api/logs',           require('./routes/logs'));
app.use('/api/issues',         require('./routes/issues'));
app.use('/api/photos',         require('./routes/photos'));
app.use('/api/notifications',  require('./routes/notifications'));
app.use('/api/dashboard',      require('./routes/dashboard'));
app.use('/api/users',          require('./routes/users'));
app.use('/api/documents',      require('./routes/documents'));
app.use('/api/equipment',      require('./routes/equipment'));
app.use('/api/suppliers',      require('./routes/suppliers'));
app.use('/api/purchase-orders',require('./routes/purchaseOrders'));
app.use('/api/safety',         require('./routes/safety'));
app.use('/api/milestones',     require('./routes/milestones'));
app.use('/api/bom',            require('./routes/bom'));
app.use('/api/audit',          require('./routes/audit'));
app.use('/api/settings',       require('./routes/settings'));
app.use('/api/estimator',      require('./routes/estimator'));
app.use('/api/material-catalog', require('./routes/materialCatalog'));

// ─── Health check ─────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'CMS API', time: new Date() }));

// ─── Error handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ CMS Server running on http://localhost:${PORT}`));

module.exports = app;
