# 🏗️ BuildTrack — Construction Management System

A full-stack Construction Management System built with **React + Vite** (frontend) and **Node.js + Express + PostgreSQL** (backend).

---

## 📦 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Recharts, DnD |
| Backend   | Node.js, Express.js                 |
| Database  | PostgreSQL 15+                      |
| Auth      | JWT (jsonwebtoken + bcryptjs)       |
| Files     | Cloudinary (photos, documents)      |
| Email     | Nodemailer (Gmail SMTP)             |
| PDF       | jsPDF + html2canvas                 |

---

## 🚀 Quick Start

### 1. PostgreSQL Setup

```sql
-- Run in psql or pgAdmin
CREATE DATABASE cms_db;
```

### 2. Backend Setup

```bash
cd server
# Copy and configure .env
cp .env.example .env
# Edit .env — set DB_PASSWORD and other values

# Install dependencies
npm install

# Run database migrations (create all 16 tables)
npm run migrate

# Seed demo data (creates 3 users + sample project)
npm run seed

# Start dev server
npm run dev
```
Server runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```
App runs on **http://localhost:5174**

---

## 🔐 Demo Login Credentials

| Role    | Email                        | Password      |
|---------|------------------------------|---------------|
| Admin   | admin@buildtrack.com         | Admin@123     |
| Manager | manager@buildtrack.com       | Manager@123   |
| Worker  | worker@buildtrack.com        | Worker@123    |

---

## 🗄️ Database Schema (16 Tables)

| Table              | Description                            |
|--------------------|----------------------------------------|
| `users`            | Auth users with roles (admin/manager/worker) |
| `projects`         | Construction projects                  |
| `workers`          | Site workers/labour                    |
| `attendance`       | Daily attendance with P/A/HD status    |
| `tasks`            | Project tasks with Kanban status       |
| `materials`        | Material inventory with stock tracking |
| `expenses`         | Budget expenses by category            |
| `daily_logs`       | Daily site progress logs               |
| `issues`           | Issue tracker with priority/status     |
| `photos`           | Site photo gallery                     |
| `notifications`    | In-app notifications                   |
| `documents`        | Document manager with versioning       |
| `equipment`        | Equipment registry                     |
| `maintenance_logs` | Equipment maintenance history          |
| `suppliers`        | Supplier directory                     |
| `purchase_orders`  | POs with line items + approval flow    |
| `po_items`         | Purchase order line items              |
| `settings`         | System-wide settings                   |

---

## 🌐 API Endpoints (55+)

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Projects
- `GET/POST /api/projects`
- `GET/PUT/DELETE /api/projects/:id`
- `GET /api/projects/:id/workers`
- `GET /api/projects/:id/tasks`
- `GET /api/projects/:id/budget`
- `GET /api/projects/:id/report`

### Workers, Attendance, Tasks, Materials, Expenses, Logs, Issues, Photos, Documents, Equipment, Suppliers, Purchase Orders — all with full CRUD

### Dashboard
- `GET /api/dashboard` — All KPIs, charts data in one call

---

## 📁 Project Structure

```
Construction management system/
├── client/                  # React + Vite Frontend
│   └── src/
│       ├── api/             # Axios + API service layer
│       ├── components/      # Layout (Sidebar, Layout)
│       ├── context/         # AuthContext (JWT)
│       └── pages/           # 25+ pages
│           ├── auth/        # Login, ForgotPassword
│           ├── dashboard/   # KPI Dashboard
│           ├── projects/    # Projects + 11 sub-pages
│           ├── workers/     # Workers + Profile
│           ├── equipment/   # Equipment + Detail
│           ├── suppliers/   # Suppliers
│           └── admin/       # Users, Settings
└── server/                  # Node.js + Express Backend
    └── src/
        ├── db/              # Pool, Migrate, Seed
        ├── middleware/      # Auth, Role, Upload
        ├── routes/          # 18 route files
        └── utils/           # Email, Helpers
```

---

## ⚙️ Environment Variables

### Server (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cms_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
EMAIL_USER=...
CLIENT_URL=http://localhost:5174
```

---

## 📧 Email Triggers
- OTP for password reset
- Budget alert when > 80% utilised
- Critical issue notification to admins
- Document expiry warnings

---

## 🔑 Role-Based Access

| Feature             | Admin | Manager | Worker |
|---------------------|-------|---------|--------|
| All Projects        | ✅    | Own     | ❌     |
| Create/Delete Users | ✅    | ❌      | ❌     |
| Approve POs         | ✅    | ❌      | ❌     |
| Log Attendance      | ✅    | ✅      | ❌     |
| Update Tasks        | ✅    | ✅      | Own    |
| Report Issues       | ✅    | ✅      | ✅     |
| View Dashboard      | ✅    | ✅      | ❌     |
| My Tasks            | ❌    | ❌      | ✅     |
