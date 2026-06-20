import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { projectsAPI, usersAPI } from '../../api';
import { Plus, Search, MapPin, Calendar, TrendingUp, X, FolderKanban, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import Pagination from '../../components/ui/Pagination';
import DateInput from '../../components/ui/DateInput';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTS = ['Planning', 'Ongoing', 'On Hold', 'Completed'];
const STATUS_COLORS = { Planning: 'badge-yellow', Ongoing: 'badge-blue', 'On Hold': 'badge-gray', Completed: 'badge-green' };



function ProjectModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? {
    ...initial,
    start_date: initial.start_date?.slice(0, 10) || '',
    end_date: initial.end_date?.slice(0, 10) || '',
    manager_id: initial.manager_id || ''
  } : { name:'', location:'', total_budget:'', start_date:'', end_date:'', status:'Planning', manager_id: '' });
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    usersAPI.getAll()
      .then(res => setManagers(res.data.filter(u => u.role === 'manager')))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      // Normalize manager_id to null if empty
      const submitData = { ...form, manager_id: form.manager_id || null };
      if (initial?.id) {
        await projectsAPI.update(initial.id, submitData);
        toast.success('Project updated!');
      } else {
        await projectsAPI.create(submitData);
        toast.success('Project created!');
      }
      onSave();
    } catch { toast.error('Failed to save project'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-lg animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group col-span-2">
              <label className="label">Project Name *</label>
              <input className="input" placeholder="e.g. Tower A Residential" value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
            </div>
            <div className="form-group col-span-2">
              <label className="label">Location *</label>
              <input className="input" placeholder="City, State" value={form.location}
                onChange={e => setForm(f => ({...f, location: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="label">Total Budget (₹) *</label>
              <input className="input" type="number" placeholder="1000000" value={form.total_budget}
                onChange={e => setForm(f => ({...f, total_budget: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Start Date *</label>
              <DateInput value={form.start_date}
                onChange={val => setForm(f => ({...f, start_date: val}))} required />
            </div>
            <div className="form-group">
              <label className="label">End Date</label>
              <DateInput value={form.end_date}
                onChange={val => setForm(f => ({...f, end_date: val}))} />
            </div>
            <div className="form-group col-span-2">
              <label className="label">Assign Manager (Optional)</label>
              <select className="select" value={form.manager_id || ''} onChange={e => setForm(f => ({...f, manager_id: e.target.value}))}>
                <option value="">— No Manager Assigned —</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : initial?.id ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const location = useLocation();
  const navigate = useNavigate();

  // Handle ?new=true to automatically open the modal
  useEffect(() => {
    if (location.search.includes('new=true')) {
      setShowModal(true);
      // Clean up the URL so it doesn't reopen on refresh
      navigate('/projects', { replace: true });
    }
  }, [location, navigate]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  useEffect(() => {
    projectsAPI.getAll()
      .then(res => setProjects(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const load = () => projectsAPI.getAll().then(res => setProjects(res.data)).catch(err => setError(err.response?.data?.message || err.message));

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const fmt = (n) => `₹${(Number(n)/100000).toFixed(1)}L`;
  const fmtDate = (d) => {
    if (!d) return 'TBD';
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProjects = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} total projects</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button className="btn-primary" onClick={() => setShowModal(true)} id="new-project-btn">
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          <p>Failed to load projects: {error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search projects or location..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUS_OPTS].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-input text-xs font-medium transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState 
          icon={FolderKanban}
          title="No projects found" 
          message="Try adjusting your search or filters, or create a new project."
          actionLabel="New Project"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedProjects.map(p => (
          <div key={p.id} className="card hover:shadow-md transition-shadow group animate-slide-up">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center text-primary font-bold font-heading text-lg">
                {p.name[0]}
              </div>
              <div className="flex items-center gap-2">
                <span className={`${STATUS_COLORS[p.status]} badge`}>{p.status}</span>
                {user?.role === 'admin' && (
                  <button type="button" className="btn-icon btn-ghost" title="Edit project"
                    onClick={() => { setEditingProject(p); setShowModal(true); }}>
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <Link to={`/projects/${p.id}`}>
              <h3 className="font-semibold text-primary  text-sm group-hover:text-accent transition-colors mb-1">{p.name}</h3>
            </Link>

            <div className="flex items-center gap-1 text-xs text-slate-500  mb-3">
              <MapPin className="w-3 h-3" /> {p.location}
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 ">Progress</span>
                <span className="font-medium text-primary ">{p.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill bg-accent" style={{ width: `${p.progress || 0}%` }} />
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-1 text-slate-500 ">
                <TrendingUp className="w-3 h-3" /> Budget
              </div>
              <span className="font-semibold text-primary ">{fmt(p.total_budget)}</span>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-1 text-xs text-slate-400 border-t border-slate-50  pt-3">
              <Calendar className="w-3 h-3" />
              {fmtDate(p.start_date)} → {fmtDate(p.end_date)}
            </div>

            <Link to={`/projects/${p.id}`} className="btn-secondary w-full justify-center mt-3 text-xs">
              View Project
            </Link>
          </div>
        ))}
      </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-between mt-8 bg-white  p-4 rounded-xl border border-slate-200  shadow-sm">
          <p className="text-sm text-slate-500 ">
            Showing <span className="font-medium text-slate-900 ">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-slate-900 ">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-slate-900 ">{filtered.length}</span> projects
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {showModal && <ProjectModal initial={editingProject}
        onClose={() => { setShowModal(false); setEditingProject(null); }}
        onSave={() => { setShowModal(false); setEditingProject(null); load(); }} />}
    </div>
  );
}
