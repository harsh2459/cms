import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workersAPI, tasksAPI } from '../../api';
import { ArrowLeft, Phone, Briefcase, IndianRupee, CheckSquare, Award, Sparkles, Loader2, RefreshCw, ThumbsUp, AlertCircle, Lightbulb, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';


const STATUS_COLORS = { Done: 'badge-green', 'In Progress': 'badge-blue', Pending: 'badge-gray' };

const RATING_STYLES = {
  excellent:          { label: 'Excellent',          badge: 'badge-green' },
  good:               { label: 'Good',               badge: 'badge-blue' },
  average:            { label: 'Average',            badge: 'badge-yellow' },
  needs_improvement:  { label: 'Needs Improvement',  badge: 'badge-red' },
};

function AddCertificationModal({ workerId, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', issue_date: '', expiry_date: '', status: 'Active' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await workersAPI.addCertification(workerId, form);
      toast.success('Certification added!');
      onSave();
    } catch { toast.error('Failed to add certification'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-sm w-full animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Add Certification</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-3">
            <div className="form-group"><label className="label">Certification Name *</label><input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required /></div>
            <div className="form-group"><label className="label">Issue Date</label><input type="date" className="input" value={form.issue_date} onChange={e => setForm(f=>({...f,issue_date:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Expiry Date</label><input type="date" className="input" value={form.expiry_date} onChange={e => setForm(f=>({...f,expiry_date:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Status</label><select className="select" value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}><option>Active</option><option>Expired</option></select></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignTaskModal({ workerId, projectId, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', phase: 'Execution', deadline: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await tasksAPI.create({ ...form, assigned_to: workerId, project_id: projectId });
      toast.success('Task assigned!');
      onSave();
    } catch { toast.error('Failed to assign task'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-sm w-full animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Assign Task</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-3">
            <div className="form-group"><label className="label">Task Title *</label><input className="input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required /></div>
            <div className="form-group"><label className="label">Phase</label><select className="select" value={form.phase} onChange={e => setForm(f=>({...f,phase:e.target.value}))}><option>Planning</option><option>Execution</option><option>Review</option></select></div>
            <div className="form-group"><label className="label">Deadline</label><input type="date" className="input" value={form.deadline} onChange={e => setForm(f=>({...f,deadline:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Priority</label><select className="select" value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value}))}><option>Low</option><option>Medium</option><option>High</option></select></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Assign'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AIReviewCard({ workerId }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    workersAPI.getAIReview(workerId)
      .then(res => setReview(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [workerId]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await workersAPI.generateAIReview(workerId);
      setReview(res.data);
      toast.success('AI review generated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate AI review');
    } finally {
      setGenerating(false);
    }
  };

  const rating = review && RATING_STYLES[review.rating];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" /> AI Performance Review
        </h3>
        <button onClick={generate} className="btn-secondary py-1 px-2 text-xs" disabled={generating}>
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {review ? 'Regenerate' : 'Analyze with AI'}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : !review && !generating ? (
        <p className="text-sm text-slate-400">No AI review yet. Click "Analyze with AI" to generate a performance summary based on attendance and task history.</p>
      ) : generating ? (
        <p className="text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> AI is analyzing this worker...</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`badge ${rating.badge}`}>{rating.label}</span>
            <span className="text-xs text-slate-400">
              Generated {new Date(review.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{review.summary}</p>

          {Array.isArray(review.strengths) && review.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-success" /> Strengths
              </p>
              <ul className="space-y-1">
                {review.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-success mt-1">•</span> {s}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(review.concerns) && review.concerns.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-danger" /> Concerns
              </p>
              <ul className="space-y-1">
                {review.concerns.map((c, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-danger mt-1">•</span> {c}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(review.recommendations) && review.recommendations.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-accent" /> Recommendations
              </p>
              <ul className="space-y-1">
                {review.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-accent mt-1">•</span> {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TASK_STATUS_OPTS = ['Pending', 'In Progress', 'Done'];
const TASK_STATUS_COLORS = {
  Done: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Pending: 'bg-slate-100 text-slate-600',
};

export default function WorkerProfilePage() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [tasks, setTasks]   = useState([]);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const loadWorker = () => {
    workersAPI.getById(id).then(r => setWorker(r.data)).catch(() => {});
  };

  const loadTasks = () => {
    tasksAPI.getAll({ assigned_to: id }).then(r => setTasks(r.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadWorker();
    loadTasks();
    setLoadingWorker(false);
  }, [id]);

  const handleTaskStatus = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      toast.success(`Status → ${newStatus}`);
    } catch { toast.error('Failed to update status'); }
  };

  if (loadingWorker) return <div className="page-wrapper"><p className="text-sm text-slate-400">Loading worker...</p></div>;
  if (!worker) return <div className="page-wrapper"><p className="text-sm text-danger">Worker not found.</p></div>;

  const present = Number(worker.present_days) || 0;
  const absent = Number(worker.absent_days) || 0;
  const half_day = Number(worker.half_days) || 0;
  const salary = (present + half_day * 0.5) * Number(worker.daily_wage || 0);

  return (
    <div className="page-wrapper">
      <Link to="/workers" className="btn-ghost btn-sm mb-5"><ArrowLeft className="w-4 h-4" /> Back to Workers</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <div className="card text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-navy-700 to-accent rounded-full flex items-center justify-center text-white font-bold text-3xl font-heading mx-auto mb-3">
            {worker.name[0]}
          </div>
          <h2 className="text-lg font-bold text-primary font-heading">{worker.name}</h2>
          <p className="text-sm text-slate-500 mb-4">{worker.skill}</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-lg">
              <span className="flex items-center gap-1.5 text-slate-500"><Phone className="w-3.5 h-3.5" /> Phone</span>
              <span className="font-medium text-primary">{worker.phone || '—'}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-lg">
              <span className="flex items-center gap-1.5 text-slate-500"><IndianRupee className="w-3.5 h-3.5" /> Daily Wage</span>
              <span className="font-medium text-primary">₹{worker.daily_wage}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-lg">
              <span className="flex items-center gap-1.5 text-slate-500"><Briefcase className="w-3.5 h-3.5" /> Project</span>
              <Link to={`/projects/${worker.project_id}`} className="text-accent text-xs hover:underline">{worker.project_name}</Link>
            </div>
          </div>
        </div>

        {/* Attendance Summary + Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Attendance Summary */}
          <div className="card">
            <h3 className="text-sm font-semibold text-primary mb-4">This Month's Attendance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Present', value: present, color:'bg-green-50 text-success' },
                { label:'Absent',  value: absent,  color:'bg-red-50 text-danger' },
                { label:'Half Day',value: half_day, color:'bg-yellow-50 text-warning' },
                { label:'Est. Salary', value: `₹${salary.toLocaleString('en-IN', {maximumFractionDigits:0})}`, color:'bg-blue-50 text-accent' },
              ].map(s => (
                <div key={s.label} className={`rounded-lg px-4 py-3 text-center ${s.color}`}>
                  <p className="text-xl font-bold font-heading">{s.value}</p>
                  <p className="text-xs opacity-75 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Performance Review */}
          <AIReviewCard workerId={id} />

          {/* Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Assigned Tasks
                <span className="badge badge-gray ml-2">{tasks.length}</span>
              </h3>
              <button onClick={() => setShowTaskModal(true)} className="btn-ghost btn-sm px-2 text-xs text-accent">
                <Plus className="w-3.5 h-3.5" /> Assign
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 p-2">No tasks assigned to this worker.</p>
              ) : tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.phase} · Due: {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</p>
                  </div>
                  {/* Status dropdown — update directly from worker profile */}
                  <select
                    value={task.status}
                    onChange={e => handleTaskStatus(task.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer appearance-none flex-shrink-0 ${TASK_STATUS_COLORS[task.status]}`}>
                    {TASK_STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCertModal && <AddCertificationModal workerId={id} onClose={() => setShowCertModal(false)} onSave={() => { setShowCertModal(false); loadWorker(); }} />}
      {showTaskModal && <AssignTaskModal workerId={id} projectId={worker.project_id} onClose={() => setShowTaskModal(false)} onSave={() => { setShowTaskModal(false); loadTasks(); }} />}
    </div>
  );
}
