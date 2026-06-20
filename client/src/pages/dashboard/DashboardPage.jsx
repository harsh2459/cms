import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../api';
import {
  FolderKanban, Users, TrendingUp, AlertTriangle, Activity,
  CheckCircle2, Clock, ArrowUpRight, IndianRupee, Plus, AlertCircle, HardHat, ClipboardCheck, X
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import WorkerDashboard from './WorkerDashboard';

const fmt = (n) => `₹${(n/100000).toFixed(1)}L`;
const pct = (s, b) => Math.round((s / b) * 100);

const STATUS_COLORS = {
  Ongoing: 'badge-blue', Planning: 'badge-yellow', Completed: 'badge-green', 'On Hold': 'badge-gray',
};
const CHART_COLORS = ['#3A7BD5', '#1A7A4A', '#B07D00', '#A02020', '#7c3aed'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'issue' or 'attendance'

  useEffect(() => {
    if (user?.role === 'worker') { setLoading(false); return; }
    dashboardAPI.get()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [user]);

  if (user?.role === 'worker') {
    return <WorkerDashboard />;
  }

  if (loading) {
    return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div>;
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, budgetChart, taskStatus, attendance, projects, recentActivity } = data;

  const kpiCards = [
    { label: 'Total Projects',    value: kpis?.totalProjects || 0,   icon: FolderKanban, color: 'bg-blue-50 text-accent', delta: `${kpis?.activeProjects || 0} active` },
    { label: 'Workers on Site',   value: kpis?.totalWorkers || 0,    icon: Users,        color: 'bg-green-50 text-success', delta: 'across all projects' },
    { label: 'Open Issues',       value: kpis?.openIssues || 0,      icon: AlertTriangle,color: 'bg-red-50 text-danger',   delta: 'need attention' },
    { label: 'Tasks Done Today',  value: kpis?.tasksCompletedToday || 0, icon: CheckCircle2, color: 'bg-purple-50 text-purple-600', delta: 'completed' },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of all active construction projects</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Activity className="w-4 h-4" />
          Live data
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi-card animate-slide-up">
              <div className={`kpi-icon ${k.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary font-heading">{k.value}</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">{k.label}</p>
                <p className="text-xs text-slate-400">{k.delta}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/projects?new=true" className="btn-secondary text-xs flex-1 justify-center py-3 border-dashed hover:border-accent hover:text-accent">
          <Plus className="w-4 h-4" /> New Project
        </Link>
        <Link to="/workers?new=true" className="btn-secondary text-xs flex-1 justify-center py-3 border-dashed hover:border-success hover:text-success">
          <HardHat className="w-4 h-4" /> Add Worker
        </Link>
        <button onClick={() => setActionModal('issues')} className="btn-secondary text-xs flex-1 justify-center py-3 border-dashed hover:border-danger hover:text-danger">
          <AlertCircle className="w-4 h-4" /> Log Issue
        </button>
        <button onClick={() => setActionModal('attendance')} className="btn-secondary text-xs flex-1 justify-center py-3 border-dashed hover:border-purple-600 hover:text-purple-600">
          <ClipboardCheck className="w-4 h-4" /> Mark Attendance
        </button>
      </div>

      {/* Budget Summary Banner */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary">Overall Budget Health</span>
          </div>
          <span className="text-sm font-bold text-slate-700">
            {fmt(kpis?.totalSpent || 0)} / {fmt(kpis?.totalBudget || 0)} spent ({pct(kpis?.totalSpent || 0, Math.max(kpis?.totalBudget || 1, 1))}%)
          </span>
        </div>
        <div className="progress-bar h-3">
          <div
            className={`progress-fill ${pct(kpis?.totalSpent || 0, Math.max(kpis?.totalBudget || 1, 1)) > 80 ? 'bg-danger' : pct(kpis?.totalSpent || 0, Math.max(kpis?.totalBudget || 1, 1)) > 60 ? 'bg-warning' : 'bg-success'}`}
            style={{ width: `${Math.min(pct(kpis?.totalSpent || 0, Math.max(kpis?.totalBudget || 1, 1)), 100)}%` }}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Budget Bar Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-primary mb-4">Budget vs Spent by Project</h3>
          <ResponsiveContainer width="99%" height={220}>
            <BarChart data={budgetChart} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[4,4,0,0]} />
              <Bar dataKey="spent"  name="Spent"  fill="#3A7BD5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Attendance */}
        <div className="card">
          <h3 className="text-sm font-semibold text-primary mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="99%" height={220}>
            <LineChart data={attendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Line type="monotone" dataKey="workers" stroke="#3A7BD5" strokeWidth={2} dot={{ fill: '#3A7BD5', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Status */}
      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-primary mb-4">Task Status by Project</h3>
        <ResponsiveContainer width="99%" height={180}>
          <BarChart data={taskStatus} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="done"       name="Completed"  fill="#1A7A4A" stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="inprogress" name="In Progress" fill="#3A7BD5" stackId="a" />
            <Bar dataKey="pending"    name="Pending"     fill="#e2e8f0" stackId="a" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Projects + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Projects list */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-primary">Active Projects</h3>
            <Link to="/projects" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {projects.map(p => (
              <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center text-navy-700 font-bold text-sm flex-shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-primary truncate">{p.name}</p>
                    <span className={STATUS_COLORS[p.status] + ' badge'}>{p.status}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill bg-accent" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">{p.progress}%</p>
                  <p className="text-xs text-slate-400">{p.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-primary">Recent Activity</h3>
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.map(item => {
              const colors = { issue: 'bg-red-100 text-danger', log: 'bg-blue-100 text-accent', budget: 'bg-yellow-100 text-warning', task: 'bg-green-100 text-success', upload: 'bg-purple-100 text-purple-600' };
              return (
                <div key={item.id} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors[item.type]?.split(' ')[0] || 'bg-slate-200'}`} />
                  <div>
                    <p className="text-xs text-slate-700 leading-relaxed">{item.msg}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Selection Modal for Quick Actions */}
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-semibold text-primary">
                Select Project for {actionModal === 'issues' ? 'Issue' : 'Attendance'}
              </h3>
              <button onClick={() => setActionModal(null)} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
            </div>
            <div className="modal-body max-h-[60vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                {projects.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}/${actionModal}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-accent hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-navy-50 rounded flex items-center justify-center text-primary font-bold text-sm">
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.location}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
