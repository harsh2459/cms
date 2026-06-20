const pool = require('./src/db/pool');
const { generatePONumber } = require('./src/utils/helpers');

async function testCreate() {
  const supplier_id = '8655f1e2-12d9-4e06-b9ee-7149df379090'; // UltraTech
  const project_id = '77da1b58-3011-417d-a120-c0b96475ba4c'; // Pharma
  const items = [{ description: 'Test', quantity: 10, unit: 'kg', unit_price: 100 }];
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const po_number = await generatePONumber();
    const subtotal = 1000;
    const taxPct = 18;
    const grand_total = 1180;
    const { rows: users } = await client.query('SELECT id FROM users LIMIT 1');
    const adminId = users[0].id;

    const po = await client.query(
      `INSERT INTO purchase_orders (po_number, supplier_id, project_id, expected_delivery, subtotal, tax_percent, grand_total, notes, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [po_number, supplier_id, project_id, '2026-06-20', subtotal, taxPct, grand_total, 'Test', adminId]
    );
    const poId = po.rows[0].id;

    for (const item of items) {
      const total = item.quantity * item.unit_price;
      await client.query(
        `INSERT INTO po_items (po_id, description, quantity, unit, unit_price, total_price)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [poId, item.description, item.quantity, item.unit, item.unit_price, total]
      );
    }
    await client.query('COMMIT');
    console.log('SUCCESS');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('FAILED:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}
testCreate();
