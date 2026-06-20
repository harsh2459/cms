import api from './axios';

// ─── AUTH ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

// ─── PROJECTS ──────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, d) => api.put(`/projects/${id}`, d),
  delete: (id) => api.delete(`/projects/${id}`),
  getWorkers: (id) => api.get(`/projects/${id}/workers`),
  getTasks: (id) => api.get(`/projects/${id}/tasks`),
  getBudget: (id) => api.get(`/projects/${id}/budget`),
  getReport: (id) => api.get(`/projects/${id}/report`),
  getAISummary: (id) => api.get(`/projects/${id}/ai-summary`),
  generateAISummary: (id) => api.post(`/projects/${id}/ai-summary`),
};

// ─── WORKERS ───────────────────────────────────────────────────────────────
export const workersAPI = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  create: (data) => api.post('/workers', data),
  update: (id, d) => api.put(`/workers/${id}`, d),
  delete: (id) => api.delete(`/workers/${id}`),
  getPayroll: (params) => api.get('/workers/payroll', { params }),
  getAIReview: (id) => api.get(`/workers/${id}/ai-review`),
  generateAIReview: (id) => api.post(`/workers/${id}/ai-review`),
  addCertification: (id, d) => api.post(`/workers/${id}/certifications`, d),
  getMe: () => api.get('/workers/me'),
  getMyDashboard: () => api.get('/workers/me/dashboard'),
  getUnlinkedUsers: () => api.get('/workers/unlinked-users'),
};

// ─── ATTENDANCE ────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getByProject: (pid, params) => api.get('/attendance', { params: { project_id: pid, ...params } }),
  log: (data) => api.post('/attendance', data),
  bulkLog: (records) => api.post('/attendance/bulk', records),
  getSummary: (wid, params) => api.get(`/attendance/summary/${wid}`, { params }),
};

// ─── TASKS ─────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, d) => api.put(`/tasks/${id}`, d),
  updateMyStatus: (id, d) => api.patch(`/tasks/${id}/my-status`, d),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// ─── MATERIALS ─────────────────────────────────────────────────────────────
export const materialsAPI = {
  getByProject: (pid) => api.get('/materials', { params: { project_id: pid } }),
  getTransactions: (pid, mid) => api.get('/materials/transactions', { params: { project_id: pid, ...(mid ? { material_id: mid } : {}) } }),
  create: (data) => api.post('/materials', data),
  update: (id, d) => api.put(`/materials/${id}`, d),
  use: (id, data) => api.patch(`/materials/${id}/use`, data),
  restock: (id, data) => api.patch(`/materials/${id}/restock`, data),
  delete: (id) => api.delete(`/materials/${id}`),
};

// ─── EXPENSES ──────────────────────────────────────────────────────────────
export const expensesAPI = {
  getByProject: (pid, params) => api.get('/expenses', { params: { project_id: pid, ...params } }),
  getSummary: (pid) => api.get('/expenses/summary', { params: { project_id: pid } }),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// ─── DAILY LOGS ────────────────────────────────────────────────────────────
export const logsAPI = {
  getByProject: (pid, params) => api.get('/logs', { params: { project_id: pid, ...params } }),
  create: (data) => api.post('/logs', data),
  update: (id, d) => api.put(`/logs/${id}`, d),
  delete: (id) => api.delete(`/logs/${id}`),
};

// ─── ISSUES ────────────────────────────────────────────────────────────────
export const issuesAPI = {
  getByProject: (pid, params) => api.get('/issues', { params: { project_id: pid, ...params } }),
  create: (data) => api.post('/issues', data),
  update: (id, d) => api.put(`/issues/${id}`, d),
  delete: (id) => api.delete(`/issues/${id}`),
};

// ─── PHOTOS ────────────────────────────────────────────────────────────────
export const photosAPI = {
  getByProject: (pid, params) => api.get('/photos', { params: { project_id: pid, ...params } }),
  upload: (formData) => api.post('/photos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/photos/${id}`, data),
  delete: (id) => api.delete(`/photos/${id}`),
};

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// ─── DOCUMENTS ─────────────────────────────────────────────────────────────
export const documentsAPI = {
  getByProject: (pid, params) => api.get('/documents', { params: { project_id: pid, ...params } }),
  getExpiring: () => api.get('/documents/expiring'),
  getUrl: (id) => api.get(`/documents/${id}/url`),
  upload: (formData) => api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
};

// ─── EQUIPMENT ─────────────────────────────────────────────────────────────
export const equipmentAPI = {
  getAll: (params) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, d) => api.put(`/equipment/${id}`, d),
  delete: (id) => api.delete(`/equipment/${id}`),
  addMaintenance: (id, d) => api.post(`/equipment/${id}/maintenance`, d),
};

// ─── SUPPLIERS ─────────────────────────────────────────────────────────────
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  create: (data) => api.post('/suppliers', data),
  update: (id, d) => api.put(`/suppliers/${id}`, d),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// ─── PURCHASE ORDERS ───────────────────────────────────────────────────────
export const purchaseOrdersAPI = {
  getByProject: (pid, params) => api.get('/purchase-orders', { params: { project_id: pid, ...params } }),
  getById: (id) => api.get(`/purchase-orders/${id}`),
  create: (data) => api.post('/purchase-orders', data),
  update: (id, data) => api.put(`/purchase-orders/${id}`, data),
  approve: (id, d) => api.patch(`/purchase-orders/${id}/approve`, d),
  reject: (id, d) => api.patch(`/purchase-orders/${id}/reject`, d),
  deliver: (id) => api.patch(`/purchase-orders/${id}/deliver`),
  delete: (id) => api.delete(`/purchase-orders/${id}`),
};

// ─── USERS (Admin) ─────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, d) => api.put(`/users/${id}`, d),
  delete: (id) => api.delete(`/users/${id}`),
  getMe: () => api.get('/users/me'),
  changePassword: (data) => api.patch('/users/me/change-password', data),
};

// ─── SETTINGS ──────────────────────────────────────────────────────────────
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

// ─── SAFETY ────────────────────────────────────────────────────────────────
export const safetyAPI = {
  getIncidents: (params) => api.get('/safety/incidents', { params }),
  createIncident: (data) => api.post('/safety/incidents', data),
  updateIncident: (id, data) => api.put(`/safety/incidents/${id}`, data),
  deleteIncident: (id) => api.delete(`/safety/incidents/${id}`),
  getChecklists: (params) => api.get('/safety/checklists', { params }),
  createChecklist: (data) => api.post('/safety/checklists', data),
  updateChecklist: (id, data) => api.put(`/safety/checklists/${id}`, data),
  deleteChecklist: (id) => api.delete(`/safety/checklists/${id}`),
};

// ─── MILESTONES ────────────────────────────────────────────────────────────
export const milestonesAPI = {
  getAll: (params) => api.get('/milestones', { params }),
  create: (data) => api.post('/milestones', data),
  update: (id, d) => api.put(`/milestones/${id}`, d),
  delete: (id) => api.delete(`/milestones/${id}`),
};

// ─── BILL OF MATERIALS ─────────────────────────────────────────────────────
export const bomAPI = {
  getAll: (params) => api.get('/bom', { params }),
  create: (data) => api.post('/bom', data),
  update: (id, d) => api.put(`/bom/${id}`, d),
  delete: (id) => api.delete(`/bom/${id}`),
};

// ─── AI ESTIMATOR ──────────────────────────────────────────────────────────
export const estimatorAPI = {
  getAll: () => api.get('/estimator'),
  getById: (id) => api.get(`/estimator/${id}`),
  estimate: (data) => api.post('/estimator/estimate', data),
  update: (id, data) => api.put(`/estimator/${id}`, data),
  delete: (id) => api.delete(`/estimator/${id}`),
  convertToProject: (id) => api.post(`/estimator/${id}/convert`),
};

// ─── MATERIAL CATALOG (price list used by AI Estimator) ───────────────────
export const materialCatalogAPI = {
  getAll: () => api.get('/material-catalog'),
  create: (data) => api.post('/material-catalog', data),
  update: (id, data) => api.put(`/material-catalog/${id}`, data),
  delete: (id) => api.delete(`/material-catalog/${id}`),
};
