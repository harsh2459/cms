require('dotenv').config();
const pool    = require('./pool');
const bcrypt  = require('bcryptjs');

async function seed() {
  console.log('🌱 Seeding database...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clean up
    await client.query('TRUNCATE TABLE users, projects, workers, tasks, expenses, materials, daily_logs, issues, suppliers, equipment, purchase_orders, notifications RESTART IDENTITY CASCADE');

    // Admin user
    const hash = await bcrypt.hash('Admin@123', 10);
    const adminRes = await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1,$2,$3,'admin') RETURNING id
    `, ['Admin User', 'admin@buildtrack.com', hash]);
    const adminId = adminRes.rows[0].id;

    // 14 Managers
    const managers = [];
    for (let i = 1; i <= 14; i++) {
      const mHash = await bcrypt.hash('Manager@123', 10);
      const res = await client.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1,$2,$3,'manager') RETURNING id
      `, [`Manager ${i}`, `manager${i}@buildtrack.com`, mHash]);
      managers.push(res.rows[0].id);
    }

    // Projects
    const projects = [
      ['Delhi Metro Phase 4', 'Delhi, DL', 85000000, '2024-01-15', '2028-12-31', 'Ongoing'],
      ['Mumbai Coastal Road', 'Mumbai, MH', 120000000, '2025-05-10', '2029-09-30', 'Ongoing'],
      ['Bangalore Tech Park', 'Bangalore, KA', 45000000, '2026-04-01', '2028-06-30', 'Planning'],
      ['Chennai Port Exp', 'Chennai, TN', 36000000, '2024-06-01', '2026-11-30', 'Ongoing'],
      ['Kolkata River Bridge', 'Kolkata, WB', 55000000, '2026-03-01', '2029-11-30', 'Planning'],
      ['Pune IT City', 'Pune, MH', 28000000, '2025-01-01', '2027-12-31', 'Ongoing'],
      ['Hyderabad Pharma Hub', 'Hyderabad, TS', 65000000, '2025-08-01', '2028-08-31', 'Ongoing'],
    ];

    for (let pIdx = 0; pIdx < projects.length; pIdx++) {
      const p = projects[pIdx];
      const m1 = managers[pIdx * 2];
      const m2 = managers[pIdx * 2 + 1];

      const projRes = await client.query(`
        INSERT INTO projects (name, location, total_budget, start_date, end_date, status, manager_id, created_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
      `, [...p, m1, adminId]);
      const pId = projRes.rows[0].id;

      const workerIds = [];
      
      // 10 Core Workers (Monthly)
      for (let i=1; i<=10; i++) {
        const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();
        const wRes = await client.query(`INSERT INTO workers (name, skill, worker_type, wage_type, daily_wage, phone, project_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [`Core Worker ${i}`, i%2===0?'Supervisor':'Operator', 'Core', 'Monthly', 25000+(i*1000), phone, pId]);
        workerIds.push(wRes.rows[0].id);
      }

      // 40 Local Daily Workers (Daily)
      for (let i=11; i<=50; i++) {
        const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();
        const skills = ['Mason', 'Helper', 'Carpenter', 'Painter', 'Steel Fixer'];
        const skill = skills[i % skills.length];
        const wRes = await client.query(`INSERT INTO workers (name, skill, worker_type, wage_type, daily_wage, phone, project_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [`Local Worker ${i}`, skill, 'Local Daily', 'Daily', 500+(i*10), phone, pId]);
        workerIds.push(wRes.rows[0].id);
      }

      // Tasks
      await client.query(`INSERT INTO tasks (title, phase, status, priority, deadline, project_id, assigned_to) VALUES
        ('Survey site boundaries','Foundation','Done','High','2025-02-01',$1,$2),
        ('Excavation and leveling','Foundation','Done','Critical','2025-03-15',$1,$3),
        ('Pour foundation concrete','Foundation','Done','Critical','2025-04-10',$1,$2),
        ('Erect steel columns phase 1','Structure','Done','High','2025-07-30',$1,$3),
        ('Erect steel columns phase 2','Structure','In Progress','Critical','2026-06-30',$1,$2),
        ('Floor slab casting','Structure','In Progress','High','2026-08-15',$1,$3),
        ('Install electrical conduits','MEP','Pending','Medium','2026-10-01',$1,$2),
        ('Plumbing rough-in','MEP','Pending','Medium','2026-11-15',$1,$3)
      `, [pId, workerIds[0], workerIds[1]]);

      // Expenses
      await client.query(`INSERT INTO expenses (category, amount, expense_date, description, project_id, added_by) VALUES
        ('Labour',450000,'2025-05-01','Payroll',$1,$2),
        ('Material',890000,'2025-06-10','Cement & steel',$1,$2),
        ('Equipment',250000,'2025-07-15','Crane hire',$1,$2),
        ('Miscellaneous',100000,'2025-02-05','Govt permits',$1,$2)
      `, [pId, adminId]);

      // Materials
      await client.query(`INSERT INTO materials (name, unit, qty_available, qty_used, price_per_unit, low_stock_threshold, project_id) VALUES
        ('Portland Cement','bags',120,4800,350,200,$1),
        ('TMT Steel Bars','kg',1500,12500,72,2000,$1),
        ('River Sand','cubic m',15,450,2200,20,$1)
      `, [pId]);

      // Logs
      await client.query(`INSERT INTO daily_logs (log_date, work_done, workers_present, project_id, logged_by) VALUES
        (NOW() - INTERVAL '3 days','Continued steel binding for 4th floor columns.',48,$1,$2),
        (NOW() - INTERVAL '2 days','Poured concrete for 4th floor columns. Minor delay due to rain.',45,$1,$2),
        (NOW() - INTERVAL '1 days','Curing concrete. Started shuttering for 5th floor slab.',50,$1,$2),
        (NOW(),'Shuttering ongoing. Received new batch of steel bars.',49,$1,$2)
      `, [pId, m1]);

      // Issues
      await client.query(`INSERT INTO issues (title, description, priority, status, project_id, reported_by) VALUES
        ('Foundation crack near column C4','Visible crack detected during inspection. Needs engineer review.','Critical','In Progress',$1,$2),
        ('Water leakage on floor 2','Rainwater seeping through shuttering.','High','Resolved',$1,$2)
      `, [pId, m2]);
    }

    // Suppliers
    await client.query(`INSERT INTO suppliers (name, contact_person, phone, email, gst_number, payment_terms, created_by) VALUES 
      ('UltraTech Cements','Rajiv Sharma','9800000001','sales@ultratech.com','27AABCC1234A1ZX','Net 30',$1),
      ('Tata Steel Build','Vikram Singh','9800000002','orders@tatasteel.com','27AABCC1234A2ZX','Net 45',$1),
      ('Local Hardware Suppliers','Amit Patel','9800000003','amit@localhw.com','27AABCC1234A3ZX','Cash',$1)
    `, [adminId]);

    // Equipment
    await client.query(`INSERT INTO equipment (name, type, model, serial_number, status, project_id) VALUES
      ('JCB Excavator 3DX','Excavator','3DX','JCB-2024-001','In Use', NULL),
      ('Tower Crane TC-50','Crane','TC-50','TC-2023-005','In Use', NULL),
      ('Concrete Mixer 500L','Mixer','MX-500','MX-2025-012','Under Maintenance', NULL),
      ('Bulldozer D8T','Earthmover','D8T','CAT-2022-889','In Use', NULL)
    `);

    await client.query('COMMIT');
    console.log('✅ Extensive Seed completed (7 projects, 14 managers, 350 workers)!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   Admin:   admin@buildtrack.com   / Admin@123');
    console.log('   Manager: manager1@buildtrack.com / Manager@123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
