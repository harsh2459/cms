import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { workersAPI, projectsAPI } from '../../api';
import { Plus, X, Search, HardHat, Phone, Users, Briefcase, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import Pagination from '../../components/ui/Pagination';

const SKILLS = ['Mason','Carpenter','Electrician','Plumber','Steel Fixer','Helper','Painter','Operator','Supervisor'];
const WORKER_TYPES = ['Core', 'Local Daily'];
const WAGE_TYPES = ['Daily', 'Monthly'];

const SKILL_COLORS = { Mason:'badge-blue', Carpenter:'badge-yellow', Electrician:'badge-purple', Plumber:'badge-green', 'Steel Fixer':'badge-navy', Helper:'badge-gray', Painter:'badge-red', Operator:'badge-green', Supervisor:'badge-navy' };

function AddWorkerModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name || '', skill: initial.skill || 'Mason', worker_type: initial.worker_type || 'Core',
    wage_type: initial.wage_type || 'Monthly', daily_wage: initial.daily_wage || '', phone: initial.phone || '',
    project_id: initial.project_id || '', user_id: initial.user_id || ''
  } : { name:'', skill:'Mason', worker_type:'Core', wage_type:'Monthly', daily_wage:'', phone:'', project_id:'', user_id:'' });
  const [loading, setLoading] = useState(false);
  const [unlinkedUsers, setUnlinkedUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    workersAPI.getUnlinkedUsers().then(r => setUnlinkedUsers(r.data || [])).catch(() => {});
    projectsAPI.getAll().then(r => setProjects(r.data || [])).catch(() => {});
  }, []);

  // Auto-switch wage type based on worker type
  const handleTypeChange = (type) => {
    setForm(f => ({ ...f, worker_type: type, wage_type: type === 'Core' ? 'Monthly' : 'Daily' }));
  };

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        ...form, 
        user_id: form.user_id || null, 
        project_id: form.project_id || null 
      };
      if (initial?.id) await workersAPI.update(initial.id, payload);
      else await workersAPI.create(payload);
      toast.success(initial?.id ? 'Worker updated!' : 'Worker added!'); onSave();
    }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to add worker'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Worker' : 'Add Worker'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body grid grid-cols-2 gap-4">
            <div className="form-group col-span-2">
              <label className="label">Full Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required />
            </div>

            <div className="form-group">
              <label className="label">Worker Type *</label>
              <select className="select" value={form.worker_type} onChange={e => handleTypeChange(e.target.value)}>
                {WORKER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Skill *</label>
              <select className="select" value={form.skill} onChange={e => setForm(f=>({...f,skill:e.target.value}))}>
                {SKILLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Wage Type *</label>
              <select className="select" value={form.wage_type} onChange={e => setForm(f=>({...f,wage_type:e.target.value}))}>
                {WAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Wage Amount (₹) *</label>
              <input type="number" className="input" value={form.daily_wage} onChange={e => setForm(f=>({...f,daily_wage:e.target.value}))} required />
            </div>

            <div className="form-group col-span-2">
              <label className="label">Phone</label>
              <input className="input" type="tel" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} />
            </div>

            <div className="form-group col-span-2">
              <label className="label">Assign to Project *</label>
              <select className="select" value={form.project_id} onChange={e => setForm(f=>({...f,project_id:e.target.value}))} required>
                <option value="">— Select a Project —</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="form-group col-span-2">
              <label className="label">Link to Login Account (optional)</label>
              <select className="select" value={form.user_id} onChange={e => setForm(f=>({...f,user_id:e.target.value}))}>
                <option value="">— Not linked —</option>
                {unlinkedUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
              <p className="text-xs text-slate-400 mt-1">Lets this worker log in and see their own tasks &amp; attendance on the worker dashboard.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : initial?.id ? 'Save Changes' : 'Add Worker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch]   = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('Core'); // Default to Core
  const [showModal, setShowModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 24;

  const location = useLocation();
  const navigate = useNavigate();

  // Handle ?new=true to automatically open the modal
  useEffect(() => {
    if (location.search.includes('new=true')) {
      setShowModal(true);
      navigate('/workers', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => { 
    workersAPI.getAll()
      .then(r => setWorkers(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false)); 
  }, []);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [search, skillFilter, typeFilter]);

  const filtered = useMemo(() => {
    return workers.filter(w => {
      const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.skill.toLowerCase().includes(search.toLowerCase());
      const matchSkill = skillFilter === 'All' || w.skill === skillFilter;
      const matchType = w.worker_type === typeFilter;
      return matchSearch && matchSkill && matchType;
    });
  }, [workers, search, skillFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedWorkers = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workers Directory</h1>
          <p className="page-subtitle">Manage project staff and daily-wage workforce across all sites.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Worker
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setTypeFilter('Core')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${typeFilter === 'Core' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <Briefcase className="w-4 h-4" />
          Core Staff ({workers.filter(w => w.worker_type === 'Core').length})
        </button>
        <button 
          onClick={() => setTypeFilter('Local Daily')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${typeFilter === 'Local Daily' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <Users className="w-4 h-4" />
          Local Daily Workers ({workers.filter(w => w.worker_type === 'Local Daily').length})
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder={`Search ${typeFilter.toLowerCase()} workers...`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {/* Skill filter — horizontally scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['All', ...SKILLS].map(s => (
            <button key={s} onClick={() => setSkillFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${skillFilter === s ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <CardSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <EmptyState 
          icon={HardHat}
          title={`No ${typeFilter.toLowerCase()} workers found`}
          message="Try adjusting your search or filters, or add a new worker."
          actionLabel="Add Worker"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedWorkers.map(w => (
            <div key={w.id} className="card hover:shadow-lg hover:-translate-y-1 transition-all group p-5 relative">
              <button type="button" className="btn-icon btn-ghost absolute top-3 right-3 z-10" title="Edit worker"
                onClick={() => { setEditingWorker(w); setShowModal(true); }}>
                <Pencil className="w-4 h-4" />
              </button>
              <Link to={`/workers/${w.id}`} className="block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-navy-700 to-accent rounded-full flex items-center justify-center text-white font-bold text-lg font-heading flex-shrink-0 shadow-inner">
                  {w.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-base truncate group-hover:text-accent transition-colors">{w.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`${SKILL_COLORS[w.skill] || 'badge-gray'} badge text-[10px]`}>{w.skill}</span>
                    {w.wage_type === 'Monthly' && <span className="badge badge-purple text-[10px]">Staff</span>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-500">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" />
                  {w.phone || 'No phone'}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="font-medium text-slate-600 truncate max-w-[60%]">{w.project_name || 'Unassigned'}</div>
                <div className="font-bold text-primary whitespace-nowrap bg-slate-50 px-2 py-1 rounded">
                  ₹{Number(w.daily_wage).toLocaleString('en-IN')}/{w.wage_type === 'Monthly' ? 'mo' : 'day'}
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex-wrap gap-3">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–<span className="font-medium text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-slate-900">{filtered.length}</span>
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {showModal && <AddWorkerModal initial={editingWorker}
        onClose={() => { setShowModal(false); setEditingWorker(null); }}
        onSave={() => { setShowModal(false); setEditingWorker(null); workersAPI.getAll().then(r => setWorkers(r.data || [])).catch(() => {}); }} />}
    </div>
  );
}
