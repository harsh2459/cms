// Equipment Detail page
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { equipmentAPI } from '../../api';
import { ArrowLeft, Plus, X, Wrench, Calendar, ChevronDown, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const STATUSES = [
  { label: 'In Use',            color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Available',         color: 'bg-green-100 text-green-700 border-green-200' },
  { label: 'Under Maintenance', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { label: 'Retired',           color: 'bg-red-100 text-red-600 border-red-200' },
];

function StatusBadge({ status }) {
  const s = STATUSES.find(x => x.label === status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s?.color || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
}



function AddMaintenanceModal({ equipmentId, onClose, onSave }) {
  const [form, setForm] = useState({ maintenance_date:'', description:'', cost:'', next_service_date:'' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await equipmentAPI.addMaintenance(equipmentId, form); toast.success('Maintenance logged!'); onSave(); }
    catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Log Maintenance</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group"><label className="label">Date *</label><input type="date" className="input" value={form.maintenance_date} onChange={e => setForm(f=>({...f,maintenance_date:e.target.value}))} required /></div>
              <div className="form-group"><label className="label">Cost (₹)</label><input type="number" className="input" value={form.cost} onChange={e => setForm(f=>({...f,cost:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="label">Description *</label><textarea className="textarea" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} required /></div>
            <div className="form-group"><label className="label">Next Service Date</label><input type="date" className="input" value={form.next_service_date} onChange={e => setForm(f=>({...f,next_service_date:e.target.value}))} /></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [eq, setEq] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statusRef = useRef(null);

  useEffect(() => {
    equipmentAPI.getById(id)
      .then(r => setEq(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load equipment details'))
      .finally(() => setLoading(false));
  }, [id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === eq.status) { setStatusOpen(false); return; }
    setUpdatingStatus(true);
    try {
      await equipmentAPI.update(id, { ...eq, status: newStatus, project_id: eq.project_id });
      setEq(prev => ({ ...prev, status: newStatus }));
      toast.success(`Status changed to "${newStatus}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
      setStatusOpen(false);
    }
  };

  const totalMaintenanceCost = (eq?.maintenance_logs || []).reduce((s, m) => s + Number(m.cost || 0), 0);

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;
  if (!eq) return null;

  return (
    <div className="page-wrapper">
      <Link to="/equipment" className="btn-ghost btn-sm mb-5"><ArrowLeft className="w-4 h-4" /> Back to Equipment</Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card">
          <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mb-3"><Wrench className="w-7 h-7 text-navy-700" /></div>
          <h2 className="font-bold text-primary font-heading text-lg">{eq.name}</h2>
          <p className="text-slate-500 text-sm mb-4">{eq.type} · {eq.model}</p>
          <div className="flex flex-col gap-2 text-sm">
            {[
              ['Serial No.', eq.serial_number || '—'],
              ['Project', eq.project_name || '—'],
              ['Purchase Date', eq.purchase_date || '—'],
              ['Purchase Value', `₹${Number(eq.purchase_value || 0).toLocaleString('en-IN')}`],
              ['Total Maintenance', `₹${totalMaintenanceCost.toLocaleString('en-IN')}`],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-primary">{v}</span>
              </div>
            ))}

            {/* Status row with dropdown */}
            <div className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Status</span>
              <div className="relative" ref={statusRef}>
                <button
                  onClick={() => (user?.role === 'admin' || user?.role === 'manager') && setStatusOpen(o => !o)}
                  disabled={updatingStatus || (user?.role !== 'admin' && user?.role !== 'manager')}
                  className={`flex items-center gap-1.5 group ${(user?.role !== 'admin' && user?.role !== 'manager') ? 'cursor-default' : ''}`}
                >
                  <StatusBadge status={eq.status} />
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    updatingStatus
                      ? <div className="w-3 h-3 border-2 border-slate-400/40 border-t-slate-500 rounded-full animate-spin" />
                      : <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {statusOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">Change Status</p>
                    {STATUSES.map(s => (
                      <button
                        key={s.label}
                        onClick={() => handleStatusChange(s.label)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${
                          eq.status === s.label ? 'font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <StatusBadge status={s.label} />
                        {eq.status === s.label && <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-primary">Maintenance History</h3>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <button className="btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus className="w-3.5 h-3.5" /> Log</button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {(eq.maintenance_logs || []).map(m => (
              <div key={m.id} className="p-4 bg-slate-50 rounded-lg border-l-4 border-l-warning">
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-primary">{m.description}</p>
                  <span className="text-sm font-bold text-primary">₹{Number(m.cost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span><Calendar className="w-3 h-3 inline mr-1" />{m.maintenance_date}</span>
                  {m.next_service_date && <span>Next: {m.next_service_date}</span>}
                  <span>by {m.logged_by_name}</span>
                </div>
              </div>
            ))}
            {!eq.maintenance_logs?.length && <div className="empty-state py-8"><p className="text-slate-500">No maintenance records yet</p></div>}
          </div>
        </div>
      </div>
      {showModal && <AddMaintenanceModal equipmentId={id} onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); equipmentAPI.getById(id).then(r => setEq(r.data)).catch(() => {}); }} />}
    </div>
  );
}
