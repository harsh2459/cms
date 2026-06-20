import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { tasksAPI, projectsAPI, workersAPI, usersAPI } from '../../api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, Calendar, User, Flag, Trash2, ChevronDown, Search, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = ['Pending', 'In Progress', 'Done'];
const PRIORITY_COLORS = { Low: 'badge-gray', Medium: 'badge-blue', High: 'badge-yellow', Critical: 'badge-red' };
const STATUS_COLORS   = { Pending: 'bg-slate-100 text-slate-600', 'In Progress': 'bg-blue-100 text-blue-700', Done: 'bg-green-100 text-green-700' };
const PHASES = ['Foundation', 'Structure', 'MEP', 'Finishing', 'Landscaping', 'Handover'];

function TaskCard({ task, index, workers, onStatusChange, onDelete, onEdit }) {
  const [changingStatus, setChangingStatus] = useState(false);
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Done';

  const handleStatusChange = async (newStatus) => {
    setChangingStatus(true);
    try {
      await tasksAPI.update(task.id, { status: newStatus });
      onStatusChange(task.id, newStatus);
      toast.success(`Status → ${newStatus}`);
    } catch { toast.error('Failed to update status'); }
    finally { setChangingStatus(false); }
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          className={`card-sm mb-2 cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'shadow-modal rotate-1' : ''} transition-transform`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium text-primary leading-snug">{task.title}</p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`${PRIORITY_COLORS[task.priority]} badge`}>{task.priority}</span>
              <button onClick={() => onEdit(task)} className="btn-icon btn-ghost text-slate-400 hover:text-accent p-0.5" title="Edit task">
                <Pencil className="w-3 h-3" />
              </button>
              <button onClick={() => { if (confirm(`Delete "${task.title}"?`)) onDelete(task.id); }}
                className="btn-icon btn-ghost text-red-400 hover:text-red-600 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-2">{task.phase}</p>

          {/* Status change dropdown */}
          <div className="mb-2">
            <select
              value={task.status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={changingStatus}
              onClick={e => e.stopPropagation()}
              className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer appearance-none w-full text-center ${STATUS_COLORS[task.status]} disabled:opacity-60`}>
              {COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            {task.assigned_name ? (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <User className="w-3 h-3" /> {task.assigned_name}
              </div>
            ) : <span className="text-xs text-slate-400 italic">Unassigned</span>}
            {task.deadline && (
              <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-danger font-medium' : 'text-slate-400'}`}>
                <Calendar className="w-3 h-3" />
                {(() => {
                  const d = new Date(task.deadline);
                  return `${d.getDate().toString().padStart(2,'0')}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getFullYear()}`;
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
/* ── Searchable Worker Combobox ─────────────────────────────── */
function WorkerCombobox({ workers, users = [], value, onChange, loading, onLoadMore, hasMore }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredWorkers = workers.filter(w =>
    w.name && (!query || w.name.toLowerCase().includes(query.toLowerCase()) || (w.skill || '').toLowerCase().includes(query.toLowerCase()))
  );

  const filteredUsers = users.filter(u =>
    u.name && (!query || u.name.toLowerCase().includes(query.toLowerCase()) || (u.role || '').toLowerCase().includes(query.toLowerCase()))
  );

  const selectedWorker = workers.find(w => String(w.id) === String(value));
  const selectedUser = users.find(u => String(u.id) === String(value));
  const selected = selectedWorker || selectedUser;
  
  const displayLabel = selectedWorker ? `${selectedWorker.name || '?'} (${selectedWorker.skill || ''})` : selectedUser ? `${selectedUser.name || '?'} (${selectedUser.role || ''})` : '— Unassigned —';

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button type="button" onClick={() => setOpen(o => !o)}
        className="input w-full flex items-center justify-between text-left">
        <span className={selected ? 'text-primary' : 'text-slate-400'}>
          {displayLabel}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-modal overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search workers..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="input pl-8 py-1.5 text-xs w-full"
              />
            </div>
          </div>

          {/* List — max 6 visible, then scroll */}
          <div className="max-h-[168px] overflow-y-auto">
            {/* Unassigned option */}
            {!query && (
              <button type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${!value ? 'bg-accent/10 text-accent font-medium' : 'text-slate-500 italic'}`}
                onClick={() => { onChange(''); setOpen(false); setQuery(''); }}>
                — Unassigned —
              </button>
            )}

            {filteredUsers.length > 0 && <div className="px-3 py-1 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Users</div>}
            {filteredUsers.map(u => (
              <button key={u.id} type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                  String(u.id) === String(value) ? 'bg-accent/10' : ''
                }`}
                onClick={() => { onChange(u.id, 'user'); setOpen(false); setQuery(''); }}>
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                  {(u.name || '?')[0]}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${String(u.id) === String(value) ? 'text-accent' : 'text-primary'}`}>{u.name || '(no name)'}</p>
                  <p className="text-[10px] text-slate-400 truncate capitalize">{u.role}</p>
                </div>
              </button>
            ))}

            {filteredWorkers.length > 0 && <div className="px-3 py-1 bg-slate-50 text-xs font-semibold text-slate-500 uppercase mt-1">Workers</div>}
            {filteredWorkers.map(w => (
              <button key={w.id} type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                  String(w.id) === String(value) ? 'bg-accent/10' : ''
                }`}
                onClick={() => { onChange(w.id, 'worker'); setOpen(false); setQuery(''); }}>
                <div className="w-6 h-6 rounded-full bg-navy-50 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                  {(w.name || '?')[0]}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${String(w.id) === String(value) ? 'text-accent' : 'text-primary'}`}>{w.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{w.skill}</p>
                </div>
              </button>
            ))}

            {filteredWorkers.length === 0 && filteredUsers.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No workers found</p>
            )}

            {/* Load more */}
            {!query && hasMore && (
              <button type="button"
                onClick={onLoadMore}
                disabled={loading}
                className="w-full text-center text-xs text-accent py-2 hover:bg-slate-50 border-t border-slate-100 disabled:opacity-50">
                {loading ? 'Loading…' : 'Load more workers'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function AddTaskModal({ projectId, workers, users, loadingWorkers, hasMoreWorkers, onLoadMoreWorkers, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? {
    title: initial.title || '', phase: initial.phase || 'Foundation', priority: initial.priority || 'Medium',
    deadline: initial.deadline?.slice(0,10) || '', description: initial.description || '',
    assigned_to: initial.assigned_to || '', assigned_user_id: initial.assigned_user_id || '', status: initial.status || 'Pending'
  } : { title:'', phase:'Foundation', priority:'Medium', deadline:'', description:'', assigned_to:'', assigned_user_id:'' });
  const [loading, setLoading] = useState(false);
  
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        ...form,
        project_id: projectId,
        // Explicitly clear the other field so the server doesn't keep a stale assignment
        assigned_to: form.assigned_to || null,
        assigned_user_id: form.assigned_user_id || null,
      };
      if (initial?.id) await tasksAPI.update(initial.id, payload);
      else await tasksAPI.create(payload);
      toast.success(initial?.id ? 'Task updated!' : 'Task created!'); onSave();
    } catch { toast.error('Failed to create task'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="form-group">
              <label className="label">Task Title *</label>
              <input className="input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Phase</label>
                <select className="select" value={form.phase} onChange={e => setForm(f=>({...f,phase:e.target.value}))}>
                  {PHASES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Priority</label>
                <select className="select" value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value}))}>
                  {['Low','Medium','High','Critical'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            {/* Assign to Worker — searchable combobox */}
            <div className="form-group">
              <label className="label">Assign to Worker</label>
              <WorkerCombobox
                workers={workers}
                users={users}
                value={form.assigned_to || form.assigned_user_id}
                onChange={(val, type) => {
                  if (type === 'user') {
                    setForm(f => ({ ...f, assigned_user_id: val, assigned_to: '' }));
                  } else if (type === 'worker') {
                    setForm(f => ({ ...f, assigned_to: val, assigned_user_id: '' }));
                  } else {
                    setForm(f => ({ ...f, assigned_to: '', assigned_user_id: '' }));
                  }
                }}
                loading={loadingWorkers}
                onLoadMore={onLoadMoreWorkers}
                hasMore={hasMoreWorkers}
              />
            </div>
            <div className="form-group">
              <label className="label">Deadline</label>
              <input type="date" className="input" value={form.deadline} onChange={e => setForm(f=>({...f,deadline:e.target.value}))} />
            </div>
            {initial?.id && <div className="form-group"><label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                {COLUMNS.map(s => <option key={s}>{s}</option>)}
              </select></div>}
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} rows={3} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : initial?.id ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { id } = useParams();
  const [tasks, setTasks]       = useState([]);
  const [workers, setWorkers]           = useState([]);
  const [users, setUsers]               = useState([]);
  const [workerOffset, setWorkerOffset] = useState(0);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [hasMoreWorkers, setHasMoreWorkers] = useState(true);
  const [loading, setLoading]           = useState(true);
  const [phaseFilter, setPhaseFilter]   = useState('All');
  const [showModal, setShowModal]       = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const WORKER_LIMIT = 10;

  const loadTasks = () =>
    projectsAPI.getTasks(id)
      .then(res => setTasks(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));

  const loadWorkers = useCallback((offset = 0, append = false) => {
    setLoadingWorkers(true);
    workersAPI.getAll({ limit: WORKER_LIMIT, offset })
      .then(r => {
        const batch = r.data || [];
        setWorkers(prev => append ? [...prev, ...batch] : batch);
        setHasMoreWorkers(batch.length === WORKER_LIMIT);
        setWorkerOffset(offset + batch.length);
      })
      .catch(() => {})
      .finally(() => setLoadingWorkers(false));
  }, []);

  const loadUsers = useCallback(() => {
    usersAPI.getAll()
      .then(r => setUsers(r.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadTasks();
    loadWorkers(0, false);
    loadUsers();
  }, [id]);

  const filteredTasks = phaseFilter === 'All' ? tasks : tasks.filter(t => t.phase === phaseFilter);

  const columns = COLUMNS.reduce((acc, col) => {
    acc[col] = filteredTasks.filter(t => t.status === col);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStatus = destination.droppableId;
    setTasks(prev => prev.map(t => t.id === Number(draggableId) || t.id === draggableId ? { ...t, status: newStatus } : t));
    try { await tasksAPI.update(draggableId, { status: newStatus }); }
    catch { toast.error('Failed to update task'); }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => (t.id === taskId || t.id === Number(taskId)) ? { ...t, status: newStatus } : t));
  };

  const handleDelete = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  const colColors = { 'Pending': 'border-t-slate-300', 'In Progress': 'border-t-accent', 'Done': 'border-t-success' };
  const colBg    = { 'Pending': 'bg-slate-50', 'In Progress': 'bg-blue-50/40', 'Done': 'bg-green-50/40' };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Board</h1>
          <p className="page-subtitle">
            {loading ? 'Loading…' : `${tasks.length} tasks · Drag or use status dropdown to update`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Phase filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', ...PHASES].map(p => (
          <button key={p} onClick={() => setPhaseFilter(p)}
            className={`px-3 py-1.5 rounded-input text-xs font-medium transition-colors ${phaseFilter === p ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {p}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map(col => (
            <div key={col} className={`rounded-card border-2 border-t-4 ${colColors[col]} border-slate-100 ${colBg[col]} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-primary">{col}</h3>
                <span className="badge badge-gray">{columns[col]?.length || 0}</span>
              </div>
              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className={`min-h-20 transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-accent/5' : ''}`}>
                    {(columns[col] || []).map((task, idx) => (
                      <TaskCard key={task.id} task={task} index={idx} workers={workers}
                        onStatusChange={handleStatusChange} onDelete={handleDelete}
                        onEdit={value => { setEditingTask(value); setShowModal(true); }} />
                    ))}
                    {provided.placeholder}
                    {(columns[col] || []).length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 text-xs text-slate-400">
                        {loading ? 'Loading...' : 'No tasks here · Drop or add one'}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <AddTaskModal
          projectId={id}
          workers={workers}
          users={users}
          loadingWorkers={loadingWorkers}
          hasMoreWorkers={hasMoreWorkers}
          onLoadMoreWorkers={() => loadWorkers(workerOffset, true)}
          initial={editingTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
          onSave={() => { setShowModal(false); setEditingTask(null); loadTasks(); }}
        />
      )}
    </div>
  );
}
