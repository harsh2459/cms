import { useEffect, useState } from 'react';
import { notificationsAPI } from '../api';
import { Bell, CheckCheck, AlertTriangle, TrendingUp, Package, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  issue:   { icon: AlertTriangle, color: 'text-danger',  bg: 'bg-red-50',    label: 'Issue' },
  budget:  { icon: TrendingUp,    color: 'text-warning', bg: 'bg-yellow-50', label: 'Budget' },
  stock:   { icon: Package,       color: 'text-accent',  bg: 'bg-blue-50',   label: 'Stock' },
  overdue: { icon: Clock,         color: 'text-purple-600', bg: 'bg-purple-50', label: 'Overdue' },
};

const FILTERS = ['All', 'Unread', 'Issue', 'Budget', 'Stock', 'Overdue'];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    notificationsAPI.getAll()
      .then(r => setNotifs(r.data || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try { await notificationsAPI.markRead(id); setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n)); }
    catch {}
  };

  const markAllRead = async () => {
    try {
      await Promise.all(notifs.filter(n => !n.is_read).map(n => notificationsAPI.markRead(n.id)));
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All marked as read');
    } catch {}
  };

  const filtered = filter === 'All' ? notifs : filter === 'Unread' ? notifs.filter(n => !n.is_read) : notifs.filter(n => n.type === filter.toLowerCase());
  const unreadCount = notifs.filter(n => !n.is_read).length;

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllRead}><CheckCheck className="w-4 h-4" />Mark all read</button>
        )}
      </div>

      {/* Filter pills — scroll on mobile */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${filter === f ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {f}{f === 'Unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(n => {
          const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.issue;
          const Icon = config.icon;
          return (
            <div key={n.id}
              className={`card flex items-start gap-3 cursor-pointer transition-all p-4 ${n.is_read ? 'opacity-70' : 'border-l-4 border-l-accent'}`}
              onClick={() => !n.is_read && markRead(n.id)}>
              <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.is_read ? 'text-slate-600' : 'font-medium text-primary'}`}>{n.message}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${config.bg} ${config.color} font-medium`}>{config.label}</span>
                </div>
              </div>
              {!n.is_read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-state"><Bell className="w-12 h-12 text-slate-300 mb-3" /><p className="text-slate-500">No notifications</p></div>
        )}
      </div>
    </div>
  );
}
