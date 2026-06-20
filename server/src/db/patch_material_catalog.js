require('dotenv').config();
const pool = require('./pool');

const SQL = `
CREATE TABLE IF NOT EXISTS material_catalog (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(150)  NOT NULL UNIQUE,
  unit        VARCHAR(50)   NOT NULL,
  unit_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_by  UUID          REFERENCES users(id),
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);
`;

async function patch() {
  console.log('Running patch: material_catalog table...');
  try {
    await pool.query(SQL);
    console.log('material_catalog table created/verified successfully!');
  } catch (err) {
    console.error('Patch failed:', err.message);
  } finally {
    await pool.end();
  }
}

patch();
