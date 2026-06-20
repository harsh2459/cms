import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { issuesAPI } from '../../api';
import { Plus, X, AlertTriangle, CheckCircle2, Clock, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES   = ['Open', 'In Progress', 'Resolved'];
const PRIORITY_COLORS = { Low: 'badge-gray', Medium: 'badge-blue', High: 'badge-yellow', Critical: 'badge-red' };
const STATUS_COLORS   = { Open: 'badge-red', 'In Progress': 'badge-yellow', Resolved: 'badge-green' };


function IssueCard({ issue, onUpdate, onEdit, onDelete }) {
  const [resolveMode, setResolveMode] = useState(false);
  const [notes, setNotes] = useState('');
  const resolve = async () => {
    try { await issuesAPI.update(issue.id, { status: 'Resolved', resolution_notes: notes }); toast.success('Issue resolved!'); onUpdate(); }
    catch { toast.error('Failed'); }
  };
  return (
    <div className={`card border-l-4 ${issue.priority === 'Critical' ? 'border-l-danger' : issue.priority === 'High' ? 'border-l-warning' : 'border-l-accent'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-primary">{issue.title}</h3>
        <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
          <span className={PRIORITY_COLORS[issue.priority] + ' badge'}>{issue.priority}</span>
          <span className={STATUS_COLORS[issue.status] + ' badge'}>{issue.status}</span>
          <button type="button" className="btn-icon btn-ghost" title="Edit issue" onClick={() => onEdit(issue)}>
            <Pencil className="w-4 h-4" />
          </button>
          <button type="button" className="btn-icon btn-ghost text-red-400 hover:text-red-600" title="Delete issue" onClick={() => onDelete(issue.id)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {issue.description && <p className="text-xs text-slate-600 mb-3">{issue.description}</p>}
      <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-1">
        <span>By {issue.reported_by_name} · {new Date(issue.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
        {issue.assigned_to_name && <span>→ {issue.assigned_to_name}</span>}
      </div>
      {issue.resolution_notes && (
        <div className="mt-2 bg-green-50 rounded px-3 py-2 text-xs text-success">
          <CheckCircle2 className="w-3 h-3 inline mr-1" />{issue.resolution_notes}
        </div>
      )}
      {issue.status !== 'Resolved' && (
        resolveMode ? (
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input className="input text-xs flex-1" placeholder="Resolution notes..." value={notes} onChange={e => setNotes(e.target.value)} />
            <div className="flex gap-2">
              <button className="btn-success btn-sm flex-1 sm:flex-none justify-center" onClick={resolve}>Resolve</button>
              <button className="btn-ghost btn-sm flex-1 sm:flex-none justify-center" onClick={() => setResolveMode(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            {issue.status === 'Open' && (
              <button className="btn-ghost btn-sm text-accent hover:text-accent hover:bg-accent/10" onClick={async () => {
                try { await issuesAPI.update(issue.id, { status: 'In Progress' }); toast.success('Marked In Progress!'); onUpdate(); }
                catch { toast.error('Failed to update'); }
              }}>
                <Clock className="w-3 h-3" /> Mark In Progress
              </button>
            )}
            <button className="btn-ghost btn-sm" onClick={() => setResolveMode(true)}>
              <CheckCircle2 className="w-3 h-3" /> Mark Resolved
            </button>
          </div>
        )
      )}
    </div>
  );
}

function AddIssueModal({ projectId, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? { title: initial.title || '', description: initial.description || '',
    priority: initial.priority || 'Medium', status: initial.status || 'Open' } : { title:'', description:'', priority:'Medium' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (initial?.id) await issuesAPI.update(initial.id, form);
      else await issuesAPI.create({ ...form, project_id: projectId });
      toast.success(initial?.id ? 'Issue updated!' : 'Issue reported!'); onSave();
    }
    catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Issue' : 'Report Issue'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="form-group">
              <label className="label">Issue Title *</label>
              <input className="input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="label">Priority</label>
              <select className="select" value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value}))}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            {initial?.id && (
              <div className="form-group">
                <label className="label">Status</label>
                <select className="select" value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-danger" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : initial?.id ? 'Save Changes' : 'Report Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function IssuesPage() {
  const { id } = useParams();
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);

  const load = () => issuesAPI.getByProject(id).then(r => setIssues(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, [id]);

  const handleDelete = async (issueId) => {
    if (!confirm('Delete this issue?')) return;
    try { await issuesAPI.delete(issueId); toast.success('Issue deleted'); load(); }
    catch { toast.error('Failed to delete issue'); }
  };

  const filtered = issues.filter(i => {
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || i.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const openCount = issues.filter(i => i.status === 'Open').length;
  const criticalCount = issues.filter(i => i.priority === 'Critical' && i.status !== 'Resolved').length;

  return (
    <div className="page-wrapper">
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">Issue Tracker</h1>
          <p className="page-subtitle">{openCount} open · {criticalCount} critical</p>
        </div>
        <button className="btn-danger" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" />Report Issue</button>
      </div>

      {criticalCount > 0 && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-card p-3 mb-5 text-sm text-danger">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />{criticalCount} critical issue(s) require immediate attention!
        </div>
      )}

      {/* Filters — wrap on mobile */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...PRIORITIES].map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${priorityFilter === p ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(issue => <IssueCard key={issue.id} issue={issue} onUpdate={load}
          onEdit={value => { setEditingIssue(value); setShowModal(true); }}
          onDelete={handleDelete} />)}
        {filtered.length === 0 && <div className="empty-state"><CheckCircle2 className="w-12 h-12 text-success mb-3" /><p className="text-slate-500">No issues found!</p></div>}
      </div>

      {showModal && <AddIssueModal projectId={id} initial={editingIssue}
        onClose={() => { setShowModal(false); setEditingIssue(null); }}
        onSave={() => { setShowModal(false); setEditingIssue(null); load(); }} />}
    </div>
  );
}
