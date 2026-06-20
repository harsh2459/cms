import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { equipmentAPI } from '../../api';
import { Plus, X, Wrench, Search, ChevronRight, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
const STATUSES = ['Available','In Use','Under Maintenance','Retired'];
const STATUS_COLORS = { Available:'badge-green', 'In Use':'badge-blue', 'Under Maintenance':'badge-yellow', Retired:'badge-gray' };

function EquipmentModal({ initialData, onClose, onSave }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(
    initialData || { name:'', type:'Excavator', model:'', serial_number:'', purchase_value:'', status:'Available' }
  );
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { 
      if (isEdit) {
        await equipmentAPI.update(initialData.id, form);
        toast.success('Equipment updated!');
      } else {
        await equipmentAPI.create(form); 
        toast.success('Equipment registered!'); 
      }
      onSave(); 
    }
    catch { toast.error('Failed to save equipment'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md w-full animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{isEdit ? 'Edit Equipment' : 'Register Equipment'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group col-span-full"><label className="label">Name *</label><input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required /></div>
            <div className="form-group"><label className="label">Type</label><input className="input" value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Model</label><input className="input" value={form.model} onChange={e => setForm(f=>({...f,model:e.target.value}))} /></div>
            {isEdit && (
              <div className="form-group"><label className="label">Status</label>
                <select className="select" value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            {!isEdit && (
              <>
                <div className="form-group"><label className="label">Serial Number</label><input className="input" value={form.serial_number} onChange={e => setForm(f=>({...f,serial_number:e.target.value}))} /></div>
                <div className="form-group"><label className="label">Value (₹)</label><input type="number" className="input" value={form.purchase_value} onChange={e => setForm(f=>({...f,purchase_value:e.target.value}))} /></div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : isEdit ? 'Save Changes' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EquipmentPage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editEq, setEditEq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    equipmentAPI.getAll()
      .then(r => setEquipment(r.data || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load equipment'))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { load(); }, []);

  const handleDelete = async (id, e) => {
    if(e) e.preventDefault(); // Prevent Link navigation
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    try {
      await equipmentAPI.delete(id);
      setEquipment(prev => prev.filter(eq => eq.id !== id));
      toast.success('Equipment deleted');
    } catch {
      toast.error('Failed to delete equipment');
    }
  };

  const types = ['All', ...Array.from(new Set(equipment.map(e => e.type).filter(Boolean))).sort()];

  const filtered = equipment.filter(e => {
    const match = e.name.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase());
    return match && (statusFilter === 'All' || e.status === statusFilter) && (typeFilter === 'All' || e.type === typeFilter);
  });

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 animate-spin rounded-full border-b-2 border-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load equipment: {error}</div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header flex-wrap gap-3">
        <div><h1 className="page-title">Equipment</h1><p className="page-subtitle">{equipment.length} registered</p></div>
        {user?.role === 'admin' && <button className="btn-primary" onClick={() => { setEditEq(null); setShowModal(true); }}><Plus className="w-4 h-4" />Register</button>}
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input pl-9" placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All',...STATUSES].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded text-xs font-medium flex-1 sm:flex-none ${statusFilter===s?'bg-primary text-white':'bg-white border border-slate-200 text-slate-600'}`}>
                {s === 'Under Maintenance' ? 'Maintenance' : s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Type:</span>
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${typeFilter===t?'bg-accent text-white':'bg-white border border-slate-200 text-slate-600 hover:border-accent hover:text-accent'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE: equipment cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-slate-400"><Wrench className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No equipment found</p></div>
        ) : filtered.map(eq => (
          <Link key={eq.id} to={`/equipment/${eq.id}`} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="font-semibold text-primary truncate">{eq.name}</p>
              <p className="text-xs text-slate-500">{eq.type} · {eq.model || '—'}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{eq.serial_number || '—'}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`${STATUS_COLORS[eq.status]} badge`}>{eq.status === 'Under Maintenance' ? 'Maintenance' : eq.status}</span>
              {eq.project_name && <span className="text-xs text-slate-400 truncate max-w-[80px]">{eq.project_name}</span>}
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            
            {user?.role === 'admin' && (
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button 
                  onClick={(e) => { e.preventDefault(); setEditEq(eq); setShowModal(true); }} 
                  className="btn-icon btn-ghost bg-white/80 p-1.5 h-auto w-auto text-slate-500 shadow-sm border border-slate-100">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => handleDelete(eq.id, e)} 
                  className="btn-icon btn-ghost bg-white/80 p-1.5 h-auto w-auto text-danger shadow-sm border border-slate-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* DESKTOP: table */}
      <div className="hidden md:block table-wrapper">
        <table className="table">
          <thead><tr><th>Equipment</th><th>Type</th><th>Model</th><th>Serial</th><th>Status</th><th>Project</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map(eq => (
              <tr key={eq.id}>
                <td><div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-slate-400" /><span className="font-medium text-primary">{eq.name}</span></div></td>
                <td className="text-slate-600">{eq.type}</td>
                <td className="text-slate-500">{eq.model || '—'}</td>
                <td className="font-mono text-xs text-slate-400">{eq.serial_number || '—'}</td>
                <td><span className={`${STATUS_COLORS[eq.status]} badge`}>{eq.status}</span></td>
                <td className="text-slate-500 text-xs">{eq.project_name || '—'}</td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    {user?.role === 'admin' && (
                      <>
                        <button onClick={(e) => { e.preventDefault(); setEditEq(eq); setShowModal(true); }} className="btn-icon btn-ghost text-slate-500 hover:bg-slate-100">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDelete(eq.id, e)} className="btn-icon btn-ghost text-danger hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <Link to={`/equipment/${eq.id}`} className="btn-secondary btn-sm ml-2">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <EquipmentModal initialData={editEq} onClose={() => { setShowModal(false); setEditEq(null); }} onSave={() => { setShowModal(false); setEditEq(null); load(); }} />}
    </div>
  );
}
