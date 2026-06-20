const { Pool } = require('pg'); 
const pool = new Pool({ user: 'postgres', password: '', host: 'localhost', port: 5432, database: 'cms_db' }); 
pool.query('SELECT po.*, s.name AS supplier_name, u1.name AS created_by_name, u2.name AS approved_by_name FROM purchase_orders po JOIN suppliers s ON po.supplier_id=s.id JOIN users u1 ON po.created_by=u1.id LEFT JOIN users u2 ON po.approved_by=u2.id WHERE po.project_id=$1 ORDER BY po.created_at DESC', ['77da1b58-3011-417d-a120-c0b96475ba4c'])
  .then(res => { console.log(res.rows); pool.end(); })
  .catch(err => { console.error('QUERY ERROR:', err); pool.end(); });
