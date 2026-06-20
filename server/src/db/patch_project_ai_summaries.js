require('dotenv').config();
const pool = require('./pool');

const SQL = `
CREATE TABLE IF NOT EXISTS project_ai_summaries (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  summary      TEXT        NOT NULL,
  risks        JSONB,
  recommendations JSONB,
  health       VARCHAR(20),
  generated_by UUID        REFERENCES users(id),
  created_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_summaries_project ON project_ai_summaries(project_id);
`;

async function patch() {
  console.log('Running patch: project_ai_summaries table...');
  try {
    await pool.query(SQL);
    console.log('project_ai_summaries table created/verified successfully!');
  } catch (err) {
    console.error('Patch failed:', err.message);
  } finally {
    await pool.end();
  }
}

patch();
