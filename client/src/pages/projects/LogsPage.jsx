import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { logsAPI } from '../../api';
import { Plus, X, Cloud, Clock, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';


function AddLogModal({ projectId, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? { log_date: initial.log_date?.slice(0,10) || '', work_done: initial.work_done || '',
    workers_present: initial.workers_present ?? '', weather_delay: Boolean(initial.weather_delay), notes: initial.notes || '' }
    : { log_date: new Date().toISOString().split('T')[0], work_done:'', workers_present:'', weather_delay:false, notes:'' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (initial?.id) await logsAPI.update(initial.id, form);
      else await logsAPI.create({ ...form, project_id: projectId });
      toast.success(initial?.id ? 'Log updated!' : 'Log saved!'); onSave();
    } catch { toast.error('Failed to save log'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Daily Log' : 'Daily Progress Log'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Date *</label>
                <input type="date" className="input" value={form.log_date} onChange={e => setForm(f=>({...f,log_date:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="label">Workers Present</label>
                <input type="number" className="input" value={form.workers_present} onChange={e => setForm(f=>({...f,workers_present:e.target.value}))} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Work Done Today *</label>
              <textarea className="textarea min-h-28" value={form.work_done} onChange={e => setForm(f=>({...f,work_done:e.target.value}))} required placeholder="Describe today's progress..." />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.weather_delay} onChange={e => setForm(f=>({...f,weather_delay:e.target.checked}))}
                className="w-4 h-4 rounded accent-accent" />
              <span className="text-sm text-slate-600">Weather delay today?</span>
            </label>
            <div className="form-group">
              <label className="label">Additional Notes</label>
              <textarea className="textarea" rows={2} value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : initial?.id ? 'Save Changes' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LogsPage() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo]   = useState('');

  const load = () => logsAPI.getByProject(id).then(r => setLogs(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, [id]);

  const handleDelete = async (logId) => {
    if (!confirm('Delete this log?')) return;
    try { await logsAPI.delete(logId); toast.success('Log deleted'); load(); }
    catch { toast.error('Failed to delete log'); }
  };

  const filtered = logs.filter(l => {
    const d = new Date(l.log_date);
    if (from && d < new Date(from)) return false;
    if (to   && d > new Date(to))   return false;
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Logs</h1>
          <p className="page-subtitle">Site progress log history</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Log
        </button>
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-3 mb-5">
        <div className="form-group">
          <label className="label">From</label>
          <input type="date" className="input" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">To</label>
          <input type="date" className="input" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        {(from || to) && <button className="btn-ghost mt-5" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
        <div className="flex flex-col gap-4">
          {filtered.map(log => (
            <div key={log.id} className="relative pl-12 animate-slide-up">
              <div className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm ${log.weather_delay ? 'bg-warning' : 'bg-accent'}`} />
              <div className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-primary">
                        {new Date(log.log_date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                      </p>
                      {log.weather_delay && (
                        <span className="flex items-center gap-1 badge badge-yellow">
                          <Cloud className="w-3 h-3" /> Weather Delay
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {log.workers_present} workers on site
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" className="btn-icon btn-ghost" title="Edit log"
                      onClick={() => { setEditingLog(log); setShowModal(true); }}><Pencil className="w-4 h-4" /></button>
                    <button type="button" className="btn-icon btn-ghost text-red-400 hover:text-red-600" title="Delete log"
                      onClick={() => handleDelete(log.id)}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-2">{log.work_done}</p>
                {log.notes && (
                  <p className="text-xs text-slate-500 border-t border-slate-50 pt-2 italic">Note: {log.notes}</p>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state"><p className="text-slate-500">No logs found</p></div>}
        </div>
      </div>

      {showModal && <AddLogModal projectId={id} initial={editingLog}
        onClose={() => { setShowModal(false); setEditingLog(null); }}
        onSave={() => { setShowModal(false); setEditingLog(null); load(); }} />}
    </div>
  );
}
