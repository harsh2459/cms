const pool = require('./pool');

async function run() {
  try {
    await pool.query('ALTER TABLE tasks ADD COLUMN assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL;');
    console.log('Successfully added assigned_user_id to tasks table');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Column already exists');
    } else {
      console.error(err);
    }
  } finally {
    pool.end();
  }
}
run();
