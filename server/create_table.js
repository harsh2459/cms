const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', password: '', host: 'localhost', port: 5432, database: 'cms_db' });

const query = `
  CREATE TABLE IF NOT EXISTS payroll_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL,
    amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
    UNIQUE(worker_id, month)
  );
`;

pool.query(query)
  .then(() => console.log('payroll_payments table created'))
  .catch(console.error)
  .finally(() => pool.end());
