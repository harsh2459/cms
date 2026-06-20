require('dotenv').config();
const pool = require('./pool');

const SQL = `
CREATE TABLE IF NOT EXISTS worker_ai_reviews (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id       UUID        NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  rating          VARCHAR(20),
  summary         TEXT        NOT NULL,
  strengths       JSONB,
  concerns        JSONB,
  recommendations JSONB,
  generated_by    UUID        REFERENCES users(id),
  created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_worker_ai_reviews_worker ON worker_ai_reviews(worker_id);
`;

async function patch() {
  console.log('Running patch: worker_ai_reviews table...');
  try {
    await pool.query(SQL);
    console.log('worker_ai_reviews table created/verified successfully!');
  } catch (err) {
    console.error('Patch failed:', err.message);
  } finally {
    await pool.end();
  }
}

patch();
