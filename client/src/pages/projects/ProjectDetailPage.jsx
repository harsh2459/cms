import { useEffect, useState } from 'react';
import { useParams, Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { projectsAPI } from '../../api';
import {
  MapPin, Calendar, TrendingUp, Users, CheckSquare, AlertTriangle, User,
  ClipboardList, Camera, FileText, BarChart3, Package, ShoppingCart, FileSearch, ArrowLeft, ShieldAlert, ListChecks,
  Sparkles, Loader2, RefreshCw, ShieldCheck, Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';
import WeatherWidget from '../../components/widgets/WeatherWidget';

const HEALTH_STYLES = {
  on_track: { label: 'On Track', badge: 'badge-green' },
  at_risk:  { label: 'At Risk',  badge: 'badge-yellow' },
  critical: { label: 'Critical', badge: 'badge-red' },
};

function AISummaryCard({ projectId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    projectsAPI.getAISummary(projectId)
      .then(res => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await projectsAPI.generateAISummary(projectId);
      setSummary(res.data);
      toast.success('AI summary generated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate AI summary');
    } finally {
      setGenerating(false);
    }
  };

  const health = summary && HEALTH_STYLES[summary.health];

  return (
    <div className="card md:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" /> AI Project Summary
        </h3>
        <button onClick={generate} className="btn-secondary py-1 px-2 text-xs" disabled={generating}>
          {generating
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <RefreshCw className="w-3.5 h-3.5" />}
          {summary ? 'Regenerate' : 'Analyze with AI'}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : !summary && !generating ? (
        <p className="text-sm text-slate-400">No AI analysis yet. Click "Analyze with AI" to get a summary of this project's health, risks, and recommendations.</p>
      ) : generating ? (
        <p className="text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> AI is analyzing this project...</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`badge ${health.badge}`}>{health.label}</span>
            <span className="text-xs text-slate-400">
              Generated {new Date(summary.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{summary.summary}</p>

          {Array.isArray(summary.risks) && summary.risks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-danger" /> Risks
              </p>
              <ul className="space-y-1">
                {summary.risks.map((r, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-danger mt-1">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(summary.recommendations) && summary.recommendations.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-accent" /> Recommendations
              </p>
              <ul className="space-y-1">
                {summary.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-accent mt-1">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



const STATUS_COLORS = { Ongoing: 'badge-blue', Planning: 'badge-yellow', 'On Hold': 'badge-gray', Completed: 'badge-green' };

const PROJECT_TABS = [
  { label: 'Overview',        icon: BarChart3,     path: '' },
  { label: 'Tasks',           icon: CheckSquare,   path: '/tasks' },
  { label: 'Budget',          icon: TrendingUp,    path: '/budget' },
  { label: 'Materials',       icon: Package,       path: '/materials' },
  { label: 'BoM',             icon: ListChecks,    path: '/bom' },
  { label: 'Attendance',      icon: Users,         path: '/attendance' },
  { label: 'Daily Logs',      icon: ClipboardList, path: '/logs' },
  { label: 'Safety',          icon: ShieldAlert,   path: '/safety' },
  { label: 'Issues',          icon: AlertTriangle, path: '/issues' },
  { label: 'Photos',          icon: Camera,        path: '/photos' },
  { label: 'Documents',       icon: FileText,      path: '/documents' },
  { label: 'Purchase Orders', icon: ShoppingCart,  path: '/purchase-orders' },
  { label: 'Timeline',        icon: BarChart3,     path: '/timeline' },
  { label: 'Report',          icon: FileSearch,    path: '/report' },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    projectsAPI.getById(id)
      .then(res => setProject(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;
  if (!project) return null;

  const fmt = (n) => `₹${(Number(n)/100000).toFixed(1)}L`;
  const fmtDate = (d) => {
    if (!d) return 'TBD';
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const spentPct = Math.round((project.spent / project.total_budget) * 100) || 0;
  const isOverview = location.pathname === `/projects/${id}`;

  const kpis = [
    { label: 'Workers', value: project.workers_count || 0, color: 'bg-blue-50 text-accent' },
    { label: 'Tasks Done', value: `${project.tasks_done || 0}/${project.tasks_total || 0}`, color: 'bg-green-50 text-success' },
    { label: 'Open Issues', value: project.open_issues || 0, color: 'bg-red-50 text-danger' },
    { label: 'Budget Used', value: `${spentPct}%`, color: spentPct > 80 ? 'bg-red-50 text-danger' : 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-6 max-w-screen-2xl">
      <div className="mb-4">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <div className="card mb-5">
        <div className="flex flex-wrap items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center text-white font-bold text-xl font-heading flex-shrink-0">
            {project.name?.[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-lg font-bold text-primary font-heading">{project.name}</h1>
              <span className={`${STATUS_COLORS[project.status]} badge`}>{project.status}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(project.start_date)} → {fmtDate(project.end_date)}</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Budget: {fmt(project.total_budget)}</span>
              {project.manager_name && (
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> Manager: {project.manager_name}</span>
              )}
            </div>
            {isOverview && <WeatherWidget location={project.location} />}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Overall Progress</span>
            <span className="font-semibold text-primary">{project.progress || 0}%</span>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-fill bg-accent" style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>

        {/* KPI mini row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map(k => (
            <div key={k.label} className={`rounded-lg px-4 py-3 ${k.color}`}>
              <p className="text-lg font-bold font-heading">{k.value}</p>
              <p className="text-xs opacity-80">{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-slate-200 mb-5 overflow-x-auto pb-px scrollbar-hide">
        {PROJECT_TABS.map(tab => {
          const Icon = tab.icon;
          const to = `/projects/${id}${tab.path}`;
          return (
            <NavLink
              key={tab.path}
              to={to}
              end={tab.path === ''}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all cursor-pointer -mb-px ${
                  isActive ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-primary hover:border-slate-300'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          );
        })}
      </div>

      {/* Project Content */}
      {isOverview ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card">
            <h3 className="text-sm font-semibold text-primary mb-3">Budget Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Budget</span>
                <span className="font-semibold">{fmt(project.total_budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Spent</span>
                <span className="font-semibold text-danger">{fmt(project.spent || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Remaining</span>
                <span className="font-semibold text-success">{fmt(project.total_budget - (project.spent || 0))}</span>
              </div>
              <div className="progress-bar h-3 mt-2">
                <div className={`progress-fill ${spentPct > 80 ? 'bg-danger' : spentPct > 60 ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${spentPct}%` }} />
              </div>
              <p className="text-xs text-slate-400">{spentPct}% of budget utilised</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-primary mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TABS.slice(1, 7).map(tab => {
                const Icon = tab.icon;
                return (
                  <Link key={tab.path} to={`/projects/${id}${tab.path}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 hover:border-accent/30 hover:bg-blue-50/50 transition-all text-xs font-medium text-slate-600 hover:text-accent">
                    <Icon className="w-4 h-4" /> {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <AISummaryCard projectId={id} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1">
          <Outlet context={{ project }} />
        </div>
      )}
    </div>
  );
}
