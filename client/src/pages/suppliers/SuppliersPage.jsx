import { useEffect, useState } from 'react';
import { suppliersAPI } from '../../api';
import { Plus, X, Search, Phone, Mail, Truck, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';

function SupplierModal({ initialData, onClose, onSave }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(
    initialData || { name:'', contact_person:'', phone:'', email:'', gst_number:'', payment_terms:'', address:'' }
  );
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try { 
      if (isEdit) {
        await suppliersAPI.update(initialData.id, form);
        toast.success('Supplier updated!');
      } else {
        await suppliersAPI.create(form); 
        toast.success('Supplier added!'); 
      }
      onSave(); 
    }
    catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body grid grid-cols-2 gap-3">
            <div className="form-group col-span-2"><label className="label">Company Name *</label><input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required /></div>
            <div className="form-group"><label className="label">Contact Person</label><input className="input" value={form.contact_person} onChange={e => setForm(f=>({...f,contact_person:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} /></div>
            <div className="form-group"><label className="label">GST Number</label><input className="input" value={form.gst_number} onChange={e => setForm(f=>({...f,gst_number:e.target.value}))} /></div>
            <div className="form-group col-span-2"><label className="label">Payment Terms</label><input className="input" placeholder="e.g. Net 30, Advance, COD" value={form.payment_terms} onChange={e => setForm(f=>({...f,payment_terms:e.target.value}))} /></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : isEdit ? 'Save Changes' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    suppliersAPI.getAll()
      .then(r => setSuppliers(r.data || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load suppliers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await suppliersAPI.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      toast.success('Supplier deleted');
    } catch {
      toast.error('Failed to delete supplier');
    }
  };

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.contact_person || '').toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">Supplier Directory</h1>
          <p className="page-subtitle">{suppliers.length} suppliers</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => { setEditSupplier(null); setShowModal(true); }}>
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        )}
      </div>
      <div className="relative max-w-72 mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input className="input pl-9" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="card relative group">
            {user?.role === 'admin' && (
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-slate-100">
                <button onClick={() => { setEditSupplier(s); setShowModal(true); }} className="btn-icon btn-ghost text-slate-500 hover:text-primary p-1.5 h-auto w-auto">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="btn-icon btn-ghost text-slate-500 hover:text-danger p-1.5 h-auto w-auto">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-3 pr-16">
              <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="font-semibold text-primary text-sm line-clamp-1">{s.name}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{s.contact_person}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              {s.phone && <div className="flex items-center gap-1.5 text-slate-600"><Phone className="w-3 h-3" />{s.phone}</div>}
              {s.email && <div className="flex items-center gap-1.5 text-slate-600"><Mail className="w-3 h-3" />{s.email}</div>}
              {s.gst_number && <p className="text-slate-400 font-mono">GST: {s.gst_number}</p>}
              {s.payment_terms && <p className="text-accent text-xs mt-1">{s.payment_terms}</p>}
            </div>
          </div>
        ))}
      </div>
      {showModal && <SupplierModal initialData={editSupplier} onClose={() => { setShowModal(false); setEditSupplier(null); }} onSave={() => { setShowModal(false); setEditSupplier(null); load(); }} />}
    </div>
  );
}
