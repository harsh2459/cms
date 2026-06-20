import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronRight, Building2 } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const location = useLocation();

  // Generate breadcrumbs from pathname
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Custom mapping for breadcrumb names
  const breadcrumbNameMap = {
    dashboard: 'Dashboard',
    projects: 'Projects',
    workers: 'Workers',
    equipment: 'Equipment',
    suppliers: 'Suppliers',
    payroll: 'Payroll',
    admin: 'Admin',
    users: 'Users',
    settings: 'Settings',
    tasks: 'Tasks',
    budget: 'Budget',
    materials: 'Materials',
    attendance: 'Attendance',
    logs: 'Daily Logs',
    issues: 'Issues',
    photos: 'Photos',
    report: 'Report',
    timeline: 'Timeline',
    documents: 'Documents',
    'purchase-orders': 'Purchase Orders'
  };

  return (
    <header className="bg-white  border-b border-slate-200  h-16 flex items-center justify-between px-4 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-slate-600  hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo (Visible only on mobile) */}
        <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 font-heading">BuildTrack</span>
        </Link>

        {/* Breadcrumbs (Hidden on very small screens) */}
        <nav className="hidden sm:flex items-center text-sm font-medium text-slate-500 ">
          <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            // If it's a UUID/ID, just show "Detail" or truncate
            const isId = value.length > 15;
            const name = isId ? 'Detail' : breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

            return (
              <div key={to} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
                {last ? (
                  <span className="text-slate-800  font-semibold">{name}</span>
                ) : (
                  <Link to={to} className="hover:text-primary transition-colors">{name}</Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>


    </header>
  );
}
