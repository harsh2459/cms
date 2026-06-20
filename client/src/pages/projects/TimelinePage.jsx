import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, milestonesAPI } from '../../api';
import { Gantt } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Plus, CheckCircle2, Flag, AlertTriangle, X, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

function AddMilestoneModal({ onClose, onSave, projectId, initial }) {
  const [form, setForm] = useState(initial ? {
    project_id: projectId, title: initial.title || '', description: initial.description || '',
    target_date: initial.target_date?.slice(0,10) || new Date().toISOString().split('T')[0], status: initial.status || 'Pending',
    completed_date: initial.completed_date?.slice(0,10) || ''
  } : { project_id: projectId, title: '', description: '', target_date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initial?.id) await milestonesAPI.update(initial.id, form);
      else await milestonesAPI.create(form);
      toast.success(initial?.id ? 'Milestone updated!' : 'Milestone created!');
      onSave();
    } catch { toast.error(initial?.id ? 'Failed to update milestone' : 'Failed to create milestone'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary flex items-center gap-2"><Flag className="w-5 h-5 text-accent" /> {initial?.id ? 'Edit Milestone' : 'Add Milestone'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group mb-4">
              <label className="label">Title *</label>
              <input className="input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required placeholder="e.g. Foundation Complete" />
            </div>
            <div className="form-group mb-4">
              <label className="label">Target Date *</label>
              <input type="date" className="input" value={form.target_date} onChange={e => setForm(f=>({...f,target_date:e.target.value}))} required />
            </div>
            <div className="form-group mb-2">
              <label className="label">Description</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
            </div>
            {initial?.id && <div className="form-group mb-2"><label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                {['Pending','Achieved','Missed'].map(s => <option key={s}>{s}</option>)}
              </select></div>}
          </div>
          <div className="modal-footer border-t border-slate-100 p-5 mt-2 flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : initial?.id ? 'Save Changes' : 'Save Milestone'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [viewMode, setViewMode] = useState('Week');
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    Promise.all([
      projectsAPI.getTasks(id),
      milestonesAPI.getAll({ project_id: id })
    ]).then(([resTasks, resMilestones]) => {
      const gTasks = [];
      const mData = resMilestones.data || [];
      setMilestones(mData);
      
      if (resTasks.data?.length) {
        resTasks.data.forEach(t => {
          let end = t.deadline ? new Date(t.deadline) : new Date(Date.now() + 86400000 * 7);
          let start = new Date(end.getTime() - 86400000 * 5);
          gTasks.push({
            id: t.id, name: t.title, start, end,
            progress: t.status === 'Done' ? 100 : t.status === 'In Progress' ? 50 : 0,
            type: 'task', project: 'project', styles: { progressColor: '#3A7BD5', progressSelectedColor: '#2B5BA0' }
          });
        });
      }

      if (mData.length) {
        mData.forEach(m => {
          let target = new Date(m.target_date);
          gTasks.push({
            id: m.id, name: m.title, start: target, end: target,
            progress: m.status === 'Achieved' ? 100 : 0,
            type: 'milestone', project: 'project', styles: { progressColor: '#1A7A4A', progressSelectedColor: '#125232' }
          });
        });
      }

      if (gTasks.length > 0) {
        setTasks(gTasks);
      } else {
        setTasks([]);
      }
    }).catch(err => setError(err.response?.data?.message || 'Failed to load timeline data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const updateMilestone = async (mId, status) => {
    try {
      await milestonesAPI.update(mId, { status, completed_date: status === 'Achieved' ? new Date().toISOString().split('T')[0] : null });
      toast.success(`Milestone ${status.toLowerCase()}`);
      loadData();
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;

  return (
    <div className="page-wrapper max-w-[100vw] overflow-hidden">
      <div className="page-header flex-wrap">
        <div>
          <h1 className="page-title">Project Timeline & Milestones</h1>
          <p className="page-subtitle">Gantt chart view of tasks and major project milestones</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['Day','Week','Month'].map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === v ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
                {v}
              </button>
            ))}
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button className="btn-primary text-xs" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          )}
        </div>
      </div>
      
      <div className="card overflow-x-auto mb-6 p-2 lg:p-5">
        <div className="min-w-[800px]">
          {tasks.length > 0 ? (
            <Gantt tasks={tasks} viewMode={viewMode} listCellWidth="200px" barFill={75}
              todayColor="rgba(58,123,213,0.05)"
              barCornerRadius={4}
              handleWidth={8}
              fontFamily="Inter, sans-serif"
              fontSize="12px"
              rowHeight={45}
            />
          ) : (
            <p className="text-slate-500 py-4 text-center">No tasks or milestones available to display timeline.</p>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><Flag className="w-4 h-4 text-accent" /> Key Milestones</h3>
        {milestones.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center border border-dashed rounded-lg border-slate-200">No milestones set. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map(m => (
              <div key={m.id} className="border border-slate-100  bg-slate-50  rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800  text-sm">{m.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${m.status === 'Achieved' ? 'badge-green' : m.status === 'Missed' ? 'badge-red' : 'badge-yellow'}`}>{m.status}</span>
                      {(user?.role === 'admin' || user?.role === 'manager') && <button type="button" className="btn-icon btn-ghost" title="Edit milestone" onClick={() => { setEditingMilestone(m); setShowModal(true); }}><Pencil className="w-4 h-4" /></button>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500  mb-3">{m.description || 'No description provided.'}</p>
                  <p className="text-xs font-medium text-slate-600  flex items-center gap-1">
                    🎯 Target: {new Date(m.target_date).toLocaleDateString()}
                  </p>
                </div>
                {m.status !== 'Achieved' && (user?.role === 'admin' || user?.role === 'manager') && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200 ">
                    <button onClick={() => updateMilestone(m.id, 'Achieved')} className="btn-success btn-sm flex-1 text-xs justify-center"><CheckCircle2 className="w-3.5 h-3.5" /> Mark Achieved</button>
                    {m.status !== 'Missed' && <button onClick={() => updateMilestone(m.id, 'Missed')} className="btn-secondary text-danger hover:border-danger btn-sm flex-1 text-xs justify-center">Missed</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddMilestoneModal initial={editingMilestone}
        onClose={() => { setShowModal(false); setEditingMilestone(null); }}
        onSave={() => { setShowModal(false); setEditingMilestone(null); loadData(); }} projectId={id} />}
    </div>
  );
}
