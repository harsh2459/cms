const { Pool } = require('pg'); 
const pool = new Pool({ user: 'postgres', password: '', host: 'localhost', port: 5432, database: 'cms_db' }); 
pool.query('SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1', ['purchase_orders'])
  .then(res => { console.table(res.rows); pool.end(); })
  .catch(err => { console.error('QUERY ERROR:', err); pool.end(); });
