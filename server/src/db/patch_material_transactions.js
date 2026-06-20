require('dotenv').config();
const pool = require('./pool');

const SQL = `
CREATE TABLE IF NOT EXISTS material_transactions (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id      UUID          NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  project_id       UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type             VARCHAR(10)   NOT NULL CHECK (type IN ('use', 'restock')),
  quantity         NUMERIC(10,2) NOT NULL,
  invoice_number   VARCHAR(100),
  invoice_url      TEXT,
  notes            TEXT,
  performed_by     UUID          NOT NULL REFERENCES users(id),
  transaction_date DATE          NOT NULL DEFAULT CURRENT_DATE,
  created_at       TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mat_txn_material ON material_transactions(material_id);
CREATE INDEX IF NOT EXISTS idx_mat_txn_project  ON material_transactions(project_id);
`;

async function patch() {
  console.log('Running patch: material_transactions table...');
  try {
    await pool.query(SQL);
    console.log('material_transactions table created/verified successfully!');
  } catch (err) {
    console.error('Patch failed:', err.message);
  } finally {
    await pool.end();
  }
}

patch();
