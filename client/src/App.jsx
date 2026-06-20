import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Layout from './components/layout/Layout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';

// Main pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import TasksPage from './pages/projects/TasksPage';
import BudgetPage from './pages/projects/BudgetPage';
import MaterialsPage from './pages/projects/MaterialsPage';
import AttendancePage from './pages/projects/AttendancePage';
import LogsPage from './pages/projects/LogsPage';
import SafetyPage from './pages/projects/SafetyPage';
import BoMPage from './pages/projects/BoMPage';
import IssuesPage from './pages/projects/IssuesPage';
import PhotosPage from './pages/projects/PhotosPage';
import ReportPage from './pages/projects/ReportPage';
import TimelinePage from './pages/projects/TimelinePage';
import DocumentsPage from './pages/projects/DocumentsPage';
import PurchaseOrdersPage from './pages/projects/PurchaseOrdersPage';
import PurchaseOrderDetailPage from './pages/projects/PurchaseOrderDetailPage';

// Worker pages
import WorkersPage from './pages/workers/WorkersPage';
import WorkerProfilePage from './pages/workers/WorkerProfilePage';
import MyTasksPage from './pages/workers/MyTasksPage';
import PayrollPage from './pages/workers/PayrollPage';

// Equipment & Supplier
import EquipmentPage from './pages/equipment/EquipmentPage';
import EquipmentDetailPage from './pages/equipment/EquipmentDetailPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';

// Admin
import UsersPage from './pages/admin/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';


// AI Estimator
import EstimatorPage from './pages/estimator/EstimatorPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"               element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login"          element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Protected — Layout wrapper */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"    element={<DashboardPage />} />

        {/* Projects */}
        <Route path="/projects"     element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />}>
          <Route path="tasks"           element={<TasksPage />} />
          <Route path="budget"          element={<BudgetPage />} />
          <Route path="materials"       element={<MaterialsPage />} />
          <Route path="attendance"      element={<AttendancePage />} />
          <Route path="logs"            element={<LogsPage />} />
          <Route path="safety"          element={<SafetyPage />} />
          <Route path="bom"             element={<BoMPage />} />
          <Route path="issues"          element={<IssuesPage />} />
          <Route path="photos"          element={<PhotosPage />} />
          <Route path="report"          element={<ReportPage />} />
          <Route path="timeline"        element={<TimelinePage />} />
          <Route path="documents"       element={<DocumentsPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="purchase-orders/:poId" element={<PurchaseOrderDetailPage />} />
        </Route>

        {/* Workers */}
        <Route path="/workers"      element={<WorkersPage />} />
        <Route path="/workers/:id"  element={<WorkerProfilePage />} />
        <Route path="/payroll"      element={<ProtectedRoute roles={['admin', 'manager']}><PayrollPage /></ProtectedRoute>} />

        {/* Worker self */}
        <Route path="/my-tasks"     element={<ProtectedRoute roles={['worker']}><MyTasksPage /></ProtectedRoute>} />

        {/* Equipment */}
        <Route path="/equipment"        element={<ProtectedRoute roles={['admin']}><EquipmentPage /></ProtectedRoute>} />
        <Route path="/equipment/:id"    element={<EquipmentDetailPage />} />

        {/* Suppliers */}
        <Route path="/suppliers"        element={<ProtectedRoute roles={['admin']}><SuppliersPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/users"      element={<ProtectedRoute roles={['admin']}><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/settings"   element={<ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>} />

        {/* AI Estimator */}
        <Route path="/estimator"        element={<ProtectedRoute roles={['admin', 'manager']}><EstimatorPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '8px' },
            success: { iconTheme: { primary: '#1A7A4A', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#A02020', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
