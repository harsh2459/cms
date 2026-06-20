// My Tasks — Worker view
import { useEffect, useState } from 'react';
import { workersAPI, tasksAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, UserX } from 'lucide-react';

const STATUS_ICON = { Done: <CheckCircle2 className="w-4 h-4 text-success" />, 'In Progress': <Clock className="w-4 h-4 text-accent" />, Pending: <AlertCircle className="w-4 h-4 text-slate-400" /> };
const PRIORITY_COLORS = { Low:'badge-gray', Medium:'badge-blue', High:'badge-yellow', Critical:'badge-red' };

export default function MyTasksPage() {
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      workersAPI.getMe().catch(() => ({ data: null })),
      tasksAPI.getMyTasks().catch(() => ({ data: [] })),
    ])
      .then(([meRes, tasksRes]) => {
        setWorker(meRes.data);
        setTasks(tasksRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-header"><div><h1 className="page-title">My Tasks</h1></div></div>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
        </div>
      </div>
    );
  }

  // Only show "not linked" if there is no worker profile AND no directly-assigned tasks
  if (!worker && tasks.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="page-header"><div><h1 className="page-title">My Tasks</h1></div></div>
        <div className="card flex flex-col items-center text-center py-10">
          <UserX className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">No tasks assigned to you yet</p>
          <p className="text-xs text-slate-400 mt-1">Tasks assigned to you by admin or manager will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Welcome back, {user?.name}</p>
        </div>
      </div>
      {tasks.length === 0 ? (
        <div className="card text-center py-10 text-slate-400">No tasks assigned to you yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map(t => {
            const isOverdue = t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Done';
            return (
              <div key={t.id} className={`card flex items-start gap-4 ${isOverdue ? 'border-l-4 border-l-danger' : t.status === 'Done' ? 'border-l-4 border-l-success opacity-70' : ''}`}>
                <div className="flex-shrink-0 mt-0.5">{STATUS_ICON[t.status]}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.status === 'Done' ? 'line-through text-slate-400' : 'text-primary'}`}>{t.title}</p>
                  {t.project_name && <p className="text-xs text-slate-400 mt-0.5">{t.project_name} · {t.phase || ''}</p>}
                  {t.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className={`${PRIORITY_COLORS[t.priority]} badge`}>{t.priority}</span>
                    <span className="text-xs text-slate-400 font-medium">{t.status}</span>
                    {t.deadline && (
                      <span className={`text-xs ${isOverdue ? 'text-danger font-medium' : 'text-slate-400'}`}>
                        Due: {new Date(t.deadline).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                        {isOverdue && ' · Overdue'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
