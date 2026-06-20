require('dotenv').config();
const pool = require('./pool');

const SQL = `
CREATE TABLE IF NOT EXISTS project_estimates (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(200)  NOT NULL,
  description     TEXT          NOT NULL,
  estimated_cost  NUMERIC(15,2),
  estimated_days  INTEGER,
  materials_json  JSONB,
  labor_json      JSONB,
  summary         TEXT,
  raw_response    JSONB,
  status          VARCHAR(20)   NOT NULL DEFAULT 'completed',
  error_message   TEXT,
  created_by      UUID          REFERENCES users(id),
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_estimates_created_by ON project_estimates(created_by);
`;

async function patch() {
  console.log('Running patch: project_estimates table...');
  try {
    await pool.query(SQL);
    console.log('project_estimates table created/verified successfully!');
  } catch (err) {
    console.error('Patch failed:', err.message);
  } finally {
    await pool.end();
  }
}

patch();
