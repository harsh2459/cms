import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FolderKanban, Users, HardHat, Bell,
  Wrench, ShoppingCart, Building2, Settings, LogOut,
  ChevronRight, Truck, FileText, ClipboardList, X, Sparkles
} from 'lucide-react';

const navConfig = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', roles: ['admin', 'manager', 'worker'] },
      { label: 'My Tasks',  icon: ClipboardList,   to: '/my-tasks',  roles: ['worker'] },
    ],
  },
  {
    section: 'Projects',
    items: [
      { label: 'Projects', icon: FolderKanban, to: '/projects', roles: ['admin', 'manager'] },
      { label: 'Workers', icon: HardHat, to: '/workers', roles: ['admin', 'manager'] },
      { label: 'Payroll', icon: FileText, to: '/payroll', roles: ['admin', 'manager'] },
      { label: 'AI Estimator', icon: Sparkles, to: '/estimator', roles: ['admin', 'manager'] },
    ],
  },
  {
    section: 'Assets',
    items: [
      { label: 'Equipment', icon: Wrench, to: '/equipment', roles: ['admin'] },
      { label: 'Suppliers', icon: Truck, to: '/suppliers', roles: ['admin'] },
    ],
  },
  {
    section: 'Admin',
    items: [
      { label: 'Users', icon: Users, to: '/admin/users', roles: ['admin'] },
      { label: 'Settings', icon: Settings, to: '/admin/settings', roles: ['admin'] },
    ],
  },
];

export default function Sidebar({ notifCount = 0, isOpen = false, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColor = { admin: 'bg-accent', manager: 'bg-success', worker: 'bg-warning' };

  return (
    <aside className={`sidebar ${isOpen ? '' : 'sidebar-closed'}`}>
      {/* Logo / Brand */}
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm font-heading leading-tight">BuildTrack</h1>
            <p className="text-blue-300 text-xs">Construction CMS</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
        {navConfig.map((group) => {
          const visibleItems = group.items.filter(i => i.roles.includes(user?.role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.section}>
              <p className="nav-section">{group.section}</p>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                  </NavLink>
                );
              })}
            </div>
          );
        })}

      </nav>

      {/* User profile footer */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded text-white/80 ${roleColor[user?.role] || 'bg-slate-500'}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={handleLogout} className="text-blue-300 hover:text-white transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
