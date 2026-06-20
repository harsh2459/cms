const { Pool } = require('pg'); 
const pool = new Pool({ user: 'postgres', password: '', host: 'localhost', port: 5432, database: 'cms_db' }); 
pool.query('SELECT column_name, column_default FROM information_schema.columns WHERE table_name = $1 AND column_name = $2', ['po_items', 'received_qty'])
  .then(res => { console.table(res.rows); pool.end(); })
  .catch(err => { console.error('QUERY ERROR:', err); pool.end(); });
