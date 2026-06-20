require('dotenv').config();
const pool = require('./pool');

const SQL = `
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- TABLE: USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'worker' CHECK (role IN ('admin','manager','worker')),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  otp           VARCHAR(10),
  otp_expires   TIMESTAMP,
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: PROJECTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200)   NOT NULL,
  location      VARCHAR(300)   NOT NULL,
  total_budget  NUMERIC(15,2)  NOT NULL,
  start_date    DATE           NOT NULL,
  end_date      DATE,
  status        VARCHAR(30)    NOT NULL DEFAULT 'Planning'
                  CHECK (status IN ('Planning','Ongoing','On Hold','Completed')),
  manager_id    UUID           REFERENCES users(id) ON DELETE SET NULL,
  created_by    UUID           NOT NULL REFERENCES users(id),
  description   TEXT,
  is_deleted    BOOLEAN        NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: WORKERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workers (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100)  NOT NULL,
  skill       VARCHAR(100)  NOT NULL,
  worker_type VARCHAR(20)   NOT NULL DEFAULT 'Core' CHECK (worker_type IN ('Core', 'Local Daily')),
  wage_type   VARCHAR(20)   NOT NULL DEFAULT 'Monthly' CHECK (wage_type IN ('Daily', 'Monthly')),
  daily_wage  NUMERIC(8,2)  NOT NULL,
  phone       VARCHAR(20),
  photo_url   TEXT,
  project_id  UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: WORKER_CERTIFICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS worker_certifications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id     UUID        NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  name          VARCHAR(200) NOT NULL,
  expiry_date   DATE,
  status        VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Revoked')),
  created_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: ATTENDANCE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id          UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id   UUID     NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  project_id  UUID     NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date        DATE     NOT NULL,
  status      VARCHAR(20) NOT NULL CHECK (status IN ('Present','Absent','Half Day')),
  notes       TEXT,
  UNIQUE(worker_id, date)
);

-- ─────────────────────────────────────────────
-- TABLE: TASKS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  phase        VARCHAR(100) NOT NULL,
  status       VARCHAR(30)  NOT NULL DEFAULT 'Pending'
                 CHECK (status IN ('Pending','In Progress','Done')),
  priority     VARCHAR(20)  NOT NULL DEFAULT 'Medium'
                 CHECK (priority IN ('Low','Medium','High','Critical')),
  deadline     DATE,
  assigned_to  UUID         REFERENCES workers(id) ON DELETE SET NULL,
  assigned_user_id UUID     REFERENCES users(id) ON DELETE SET NULL,
  project_id   UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  completed_at TIMESTAMP,
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: MATERIALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS materials (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(150)  NOT NULL,
  unit                VARCHAR(50)   NOT NULL,
  qty_available       NUMERIC(10,2) NOT NULL DEFAULT 0,
  qty_used            NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_unit      NUMERIC(10,2) NOT NULL,
  low_stock_threshold NUMERIC(10,2) NOT NULL DEFAULT 10,
  supplier_name       VARCHAR(150),
  supplier_phone      VARCHAR(20),
  project_id          UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at          TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: EXPENSES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  category     VARCHAR(50)   NOT NULL
                 CHECK (category IN ('Labour','Material','Equipment','Transport','Miscellaneous')),
  amount       NUMERIC(12,2) NOT NULL,
  description  TEXT,
  expense_date DATE          NOT NULL,
  receipt_url  TEXT,
  project_id   UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  added_by     UUID          NOT NULL REFERENCES users(id),
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: DAILY_LOGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_logs (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date         DATE      NOT NULL,
  work_done        TEXT      NOT NULL,
  workers_present  INTEGER   NOT NULL DEFAULT 0,
  materials_used   TEXT,
  weather_delay    BOOLEAN   NOT NULL DEFAULT FALSE,
  notes            TEXT,
  project_id       UUID      NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  logged_by        UUID      NOT NULL REFERENCES users(id),
  created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: ISSUES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS issues (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  priority         VARCHAR(20)  NOT NULL DEFAULT 'Medium'
                     CHECK (priority IN ('Low','Medium','High','Critical')),
  status           VARCHAR(30)  NOT NULL DEFAULT 'Open'
                     CHECK (status IN ('Open','In Progress','Resolved')),
  photo_url        TEXT,
  resolved_at      TIMESTAMP,
  resolution_notes TEXT,
  reported_by      UUID         NOT NULL REFERENCES users(id),
  assigned_to      UUID         REFERENCES users(id),
  project_id       UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: PHOTOS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS photos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  url          TEXT        NOT NULL,
  caption      VARCHAR(300),
  photo_date   DATE        NOT NULL,
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by  UUID        NOT NULL REFERENCES users(id),
  created_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: NOTIFICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL,
  message     TEXT        NOT NULL,
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  project_id  UUID        REFERENCES projects(id) ON DELETE SET NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: DOCUMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(200) NOT NULL,
  category     VARCHAR(50)  NOT NULL
                 CHECK (category IN ('Contract','Drawing','Permit','Invoice','Report','Other')),
  file_url     TEXT         NOT NULL,
  file_type    VARCHAR(20)  NOT NULL,
  version      INTEGER      NOT NULL DEFAULT 1,
  expiry_date  DATE,
  access_level VARCHAR(20)  NOT NULL DEFAULT 'all'
                 CHECK (access_level IN ('all','admin')),
  project_id   UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by  UUID         NOT NULL REFERENCES users(id),
  parent_id    UUID         REFERENCES documents(id) ON DELETE SET NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: EQUIPMENT
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS equipment (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(150)  NOT NULL,
  type            VARCHAR(100)  NOT NULL,
  model           VARCHAR(100),
  serial_number   VARCHAR(100)  UNIQUE,
  purchase_date   DATE,
  purchase_value  NUMERIC(12,2),
  status          VARCHAR(30)   NOT NULL DEFAULT 'Available'
                    CHECK (status IN ('Available','In Use','Under Maintenance','Retired')),
  project_id      UUID          REFERENCES projects(id) ON DELETE SET NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: MAINTENANCE_LOGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id     UUID          NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_date DATE          NOT NULL,
  description      TEXT          NOT NULL,
  cost             NUMERIC(10,2) NOT NULL DEFAULT 0,
  next_service_date DATE,
  logged_by        UUID          NOT NULL REFERENCES users(id),
  created_at       TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: SUPPLIERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(150) NOT NULL,
  contact_person  VARCHAR(100),
  phone           VARCHAR(20),
  email           VARCHAR(150),
  gst_number      VARCHAR(20),
  payment_terms   VARCHAR(100),
  address         TEXT,
  created_by      UUID        NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: PURCHASE_ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_orders (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number         VARCHAR(50)   NOT NULL UNIQUE,
  status            VARCHAR(30)   NOT NULL DEFAULT 'Draft'
                      CHECK (status IN ('Draft','Approved','Ordered','Delivered','Closed')),
  supplier_id       UUID          NOT NULL REFERENCES suppliers(id),
  project_id        UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  expected_delivery DATE,
  subtotal          NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_percent       NUMERIC(5,2)  NOT NULL DEFAULT 18,
  grand_total       NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes             TEXT,
  approved_by       UUID          REFERENCES users(id),
  approved_at       TIMESTAMP,
  rejection_notes   TEXT,
  delivery_photo    TEXT,
  created_by        UUID          NOT NULL REFERENCES users(id),
  created_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: PO_ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS po_items (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id        UUID          NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  description  VARCHAR(200)  NOT NULL,
  quantity     NUMERIC(10,2) NOT NULL,
  unit         VARCHAR(50)   NOT NULL,
  unit_price   NUMERIC(10,2) NOT NULL,
  total_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
  material_id  UUID          REFERENCES materials(id) ON DELETE SET NULL,
  received_qty NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────────
-- TABLE: SETTINGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id              SERIAL PRIMARY KEY,
  company_name    VARCHAR(200) NOT NULL DEFAULT 'BuildTrack Construction',
  logo_url        TEXT,
  timezone        VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
  currency        VARCHAR(10)  NOT NULL DEFAULT 'INR',
  currency_symbol VARCHAR(5)   NOT NULL DEFAULT '₹',
  updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO settings (company_name) VALUES ('BuildTrack Construction') ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_workers_project      ON workers(project_id);
CREATE INDEX IF NOT EXISTS idx_attendance_worker    ON attendance(worker_id);
CREATE INDEX IF NOT EXISTS idx_attendance_project   ON attendance(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project        ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status         ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_materials_project    ON materials(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_project     ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_project   ON daily_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_project       ON issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_status        ON issues(status);
CREATE INDEX IF NOT EXISTS idx_photos_project       ON photos(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_project    ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_equipment_project    ON equipment(project_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_equip    ON maintenance_logs(equipment_id);
CREATE INDEX IF NOT EXISTS idx_po_project           ON purchase_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_po_items_po          ON po_items(po_id);
-- ─────────────────────────────────────────────
-- TABLE: SAFETY_INCIDENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS safety_incidents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reported_by      UUID        NOT NULL REFERENCES users(id),
  incident_date    DATE        NOT NULL,
  incident_type    VARCHAR(50) NOT NULL CHECK (incident_type IN ('Injury', 'Near Miss', 'Property Damage', 'Fire', 'Other')),
  description      TEXT        NOT NULL,
  location_on_site VARCHAR(200),
  severity         VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  workers_involved TEXT,
  medical_attention_required BOOLEAN DEFAULT FALSE,
  status           VARCHAR(30) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Investigating', 'Closed')),
  closed_at        TIMESTAMP,
  photo_url        TEXT,
  created_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: SAFETY_CHECKLISTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS safety_checklists (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  checklist_date      DATE        NOT NULL,
  checked_by          UUID        NOT NULL REFERENCES users(id),
  ppe_compliance      BOOLEAN     DEFAULT FALSE,
  scaffolding_safe    BOOLEAN     DEFAULT FALSE,
  electrical_safe     BOOLEAN     DEFAULT FALSE,
  fire_exits_clear    BOOLEAN     DEFAULT FALSE,
  first_aid_available BOOLEAN     DEFAULT FALSE,
  signage_in_place    BOOLEAN     DEFAULT FALSE,
  notes               TEXT,
  created_at          TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: MILESTONES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS milestones (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  target_date    DATE        NOT NULL,
  completed_date DATE,
  status         VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Achieved', 'Missed')),
  created_at     TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: BILL_OF_MATERIALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bill_of_materials (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  material_name   VARCHAR(200) NOT NULL,
  unit            VARCHAR(50) NOT NULL,
  planned_qty     NUMERIC(10,2) NOT NULL DEFAULT 0,
  actual_qty_used NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit_price      NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);
-- ─────────────────────────────────────────────
-- TABLE: MATERIAL_TRANSACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS material_transactions (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id  UUID          NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  project_id   UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type         VARCHAR(10)   NOT NULL CHECK (type IN ('use', 'restock')),
  quantity     NUMERIC(10,2) NOT NULL,
  invoice_number VARCHAR(100),
  invoice_url  TEXT,
  notes        TEXT,
  performed_by UUID          NOT NULL REFERENCES users(id),
  transaction_date DATE      NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mat_txn_material ON material_transactions(material_id);
CREATE INDEX IF NOT EXISTS idx_mat_txn_project  ON material_transactions(project_id);

-- ─────────────────────────────────────────────
-- TABLE: AUDIT_LOGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
  project_id  UUID        REFERENCES projects(id) ON DELETE CASCADE,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50)  NOT NULL,
  entity_id   UUID,
  details     TEXT,
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: PROJECT_ESTIMATES (AI Estimator)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_estimates (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(200)  NOT NULL,
  description     TEXT          NOT NULL,
  estimated_cost  NUMERIC(15,2),
  estimated_days  INTEGER,
  materials_json  JSONB,
  labor_json      JSONB,
  summary         TEXT,
  raw_response    JSONB,
  status          VARCHAR(20)   NOT NULL DEFAULT 'completed',
  error_message   TEXT,
  created_by      UUID          REFERENCES users(id),
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_estimates_created_by ON project_estimates(created_by);

-- ─────────────────────────────────────────────
-- TABLE: MATERIAL_CATALOG (reusable price list for AI Estimator)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS material_catalog (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(150)  NOT NULL UNIQUE,
  unit        VARCHAR(50)   NOT NULL,
  unit_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_by  UUID          REFERENCES users(id),
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: PROJECT_AI_SUMMARIES (cached AI analysis per project)
-- ─────────────────────────────────────────────
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

-- ─────────────────────────────────────────────
-- TABLE: WORKER_AI_REVIEWS (cached AI performance review per worker)
-- ─────────────────────────────────────────────
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

async function migrate() {
  console.log('🔄 Running migrations...');
  try {
    await pool.query(SQL);
    console.log('✅ All tables created/verified successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();
