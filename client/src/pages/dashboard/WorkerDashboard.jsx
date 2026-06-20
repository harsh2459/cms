import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { workersAPI, tasksAPI } from '../../api';
import { CheckSquare, CalendarDays, TrendingUp, Clock, UserX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [linked, setLinked] = useState(true);
  const [data, setData] = useState({
    myTasks: [],
    recentAttendance: [],
    stats: { tasksDone: 0, daysPresent: 0, pendingTasks: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      workersAPI.getMyDashboard(),
      tasksAPI.getMyTasks(),
    ])
      .then(([dashRes, tasksRes]) => {
        // null data means no worker profile AND no direct user assignments
        if (!dashRes.data) { setLinked(false); return; }
        setData({
          stats: dashRes.data.stats,
          recentAttendance: dashRes.data.recentAttendance || [],
          myTasks: (tasksRes.data || []).filter(t => t.status !== 'Done').slice(0, 5),
        });
        // Only show "not linked" if also no tasks assigned directly
        if (!dashRes.data.hasWorkerProfile && (tasksRes.data || []).length === 0) {
          setLinked(false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-slate-100 rounded-lg w-1/2" />
          <div className="h-24 bg-slate-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!linked) {
    return (
      <div className="page-wrapper max-w-5xl mx-auto">
        <div className="card flex flex-col items-center text-center py-10">
          <UserX className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">Your account isn't linked to a worker profile yet</p>
          <p className="text-xs text-slate-400 mt-1">Ask your admin or manager to link your login to a worker record in the Workers page, then your tasks and attendance will show up here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.[0] || 'W'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900 font-heading">Welcome back, {user?.name}</h1>
          <p className="text-slate-500">Here is your schedule and task overview for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-blue-50/50 border-none">
          <div className="flex items-center gap-3 mb-2 text-accent">
            <CheckSquare className="w-5 h-5" />
            <h3 className="font-semibold">Pending Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{data.stats.pendingTasks}</p>
        </div>
        <div className="card bg-green-50/50 border-none">
          <div className="flex items-center gap-3 mb-2 text-success">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold">Tasks Completed</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{data.stats.tasksDone}</p>
        </div>
        <div className="card bg-purple-50/50 border-none">
          <div className="flex items-center gap-3 mb-2 text-purple-600">
            <CalendarDays className="w-5 h-5" />
            <h3 className="font-semibold">Days Present (This Mo.)</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{data.stats.daysPresent}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">My Current Tasks</h3>
            <Link to="/my-tasks" className="text-xs text-accent hover:underline">View All</Link>
          </div>
          {data.myTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No pending tasks. Nice work!</p>
          ) : (
            <div className="space-y-3">
              {data.myTasks.map(task => {
                const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Done';
                return (
                  <div key={task.id} className={`p-3 border rounded-lg ${isOverdue ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm text-slate-800 flex-1 pr-2">{task.title}</p>
                      <span className={`badge ${task.priority === 'High' || task.priority === 'Critical' ? 'badge-red' : 'badge-yellow'} text-[10px] flex-shrink-0`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.project_name && <p className="text-[10px] text-slate-400 mb-1">{task.project_name}</p>}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                      <span className={`font-medium ${task.status === 'In Progress' ? 'text-accent' : 'text-slate-400'}`}>{task.status}</span>
                      {task.deadline && (
                        <span className={`flex items-center gap-0.5 ${isOverdue ? 'text-danger font-medium' : 'text-slate-400'}`}>
                          <Clock className="w-3 h-3" /> {new Date(task.deadline).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-primary mb-4">Recent Attendance</h3>
          {data.recentAttendance.length === 0 ? (
            <p className="text-sm text-slate-400">No attendance recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {data.recentAttendance.map((att, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-sm">
                  <span className="text-slate-600 font-medium">{new Date(att.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <span className={`badge ${att.status === 'Present' ? 'badge-green' : att.status === 'Half Day' ? 'badge-yellow' : 'badge-red'}`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
