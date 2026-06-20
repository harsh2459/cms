import { useEffect, useState } from 'react';
import { usersAPI } from '../../api';
import { Users, UserCheck, UserX, Plus, X, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

function UserModal({ initialData, onClose, onSave }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(
    initialData || { name: '', email: '', password: '', role: 'worker' }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try { 
      if (isEdit) {
        await usersAPI.update(initialData.id, form);
        toast.success('User updated successfully');
      } else {
        await usersAPI.create(form); 
        toast.success('User created successfully'); 
      }
      onSave(); 
    }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to save user'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md w-full animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{isEdit ? 'Edit User' : 'New User'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="form-group"><label className="label">Full Name *</label><input className="input" placeholder="e.g. Rahul Gupta" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label className="label">Email Address *</label><input type="email" className="input" placeholder="rahul@buildtrack.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required disabled={isEdit} /></div>
            <div className="form-group">
              <label className="label">{isEdit ? 'New Password (Optional)' : 'Temporary Password *'}</label>
              <input type="text" className="input" placeholder={isEdit ? "Leave blank to keep current" : "Password@123"} value={form.password || ''} onChange={e => setForm({...form, password: e.target.value})} required={!isEdit} />
            </div>
            <div className="form-group">
              <label className="label">Role *</label>
              <select className="select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="worker">Worker</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ROLE_COLORS = { admin:'badge-navy', manager:'badge-blue', worker:'badge-green' };
const ROLE_BG = { admin:'bg-navy-700 text-white', manager:'bg-blue-100 text-blue-800', worker:'bg-green-100 text-green-800' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const load = () => usersAPI.getAll().then(r => setUsers(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggleActive = async (userId, current) => {
    try {
      await usersAPI.update(userId, { is_active: !current });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !current } : u));
      toast.success(current ? 'User deactivated' : 'User activated');
    } catch { toast.error('Failed'); }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await usersAPI.update(userId, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;
    try {
      await usersAPI.delete(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user';
      const isLinked = err.response?.status === 409;
      if (isLinked) {
        const deactivate = window.confirm(
          `${msg}\n\nWould you like to deactivate this account instead?`
        );
        if (deactivate) {
          try {
            await usersAPI.update(userId, { is_active: false });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: false } : u));
            toast.success('User deactivated');
          } catch { toast.error('Failed to deactivate user'); }
        }
      } else {
        toast.error(msg);
      }
    }
  };

  const fmtDate = (d) => {
    if (!d) return 'TBD';
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getFullYear()}`;
  };

  return (
    <div className="page-wrapper">
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.filter(u => u.is_active).length} active users</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditUser(null); setShowModal(true); }}><Plus className="w-4 h-4" />Add User</button>
      </div>

      {/* MOBILE: user cards */}
      <div className="md:hidden space-y-3">
        {users.length === 0 ? (
          <div className="card p-8 text-center text-slate-400"><Users className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No users yet</p></div>
        ) : users.map(u => (
          <div key={u.id} className="card p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-50 rounded-full flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">{u.name?.[0]}</div>
                <div>
                  <p className="font-semibold text-primary">{u.name}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5"><Mail className="w-3 h-3" />{u.email}</div>
                </div>
              </div>
              <span className={u.is_active ? 'badge badge-green' : 'badge badge-gray'}>{u.is_active ? 'Active' : 'Inactive'}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Role</p>
                <select
                  className={`text-xs px-2 py-1 rounded border-0 cursor-pointer font-medium ${ROLE_BG[u.role] || 'bg-slate-100 text-slate-700'}`}
                  value={u.role}
                  onChange={e => changeRole(u.id, e.target.value)}
                >
                  {['admin','manager','worker'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" />{fmtDate(u.created_at)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(u.id, u.is_active)}
                className={`flex-1 justify-center ${u.is_active ? 'btn-secondary text-warning' : 'btn-success'} btn-sm btn`}
              >
                {u.is_active ? <><UserX className="w-3.5 h-3.5" />Deactivate</> : <><UserCheck className="w-3.5 h-3.5" />Activate</>}
              </button>
              <button onClick={() => { setEditUser(u); setShowModal(true); }} className="btn-icon btn-secondary btn-sm"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(u.id)} className="btn-icon btn-secondary text-danger btn-sm"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP: table */}
      <div className="hidden md:block table-wrapper">
        <table className="table">
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><div className="flex items-center gap-2"><div className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center font-semibold text-primary text-sm">{u.name?.[0]}</div><span className="font-medium text-primary">{u.name}</span></div></td>
                <td className="text-slate-500 text-xs">{u.email}</td>
                <td>
                  <select className={`${ROLE_COLORS[u.role]} badge border-0 cursor-pointer`} value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                    {['admin','manager','worker'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td><span className={u.is_active ? 'badge badge-green' : 'badge badge-gray'}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                <td className="text-xs text-slate-400">{fmtDate(u.created_at)}</td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => toggleActive(u.id, u.is_active)} className={u.is_active ? 'btn-secondary text-warning btn-sm btn' : 'btn-success btn-sm btn'}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => { setEditUser(u); setShowModal(true); }} className="btn-icon btn-ghost text-slate-500"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(u.id)} className="btn-icon btn-ghost text-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <UserModal initialData={editUser} onClose={() => { setShowModal(false); setEditUser(null); }} onSave={() => { setShowModal(false); setEditUser(null); load(); }} />}
    </div>
  );
}
