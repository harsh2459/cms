import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { purchaseOrdersAPI, suppliersAPI } from '../../api';
import { Plus, X, CheckCircle, XCircle, Package, ExternalLink, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const PO_STATUSES = ['Draft','Approved','Ordered','Delivered','Closed'];
const STATUS_COLORS = { Draft:'badge-gray', Approved:'badge-green', Ordered:'badge-blue', Delivered:'badge-purple', Closed:'badge-navy' };

import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';

function CreatePOModal({ projectId, onClose, onSave, initial }) {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initial ? { supplier_id: initial.supplier_id || '', expected_delivery: initial.expected_delivery?.slice(0,10) || '', tax_percent: initial.tax_percent ?? 18, notes: initial.notes || '' } : { supplier_id:'', expected_delivery:'', tax_percent:18, notes:'' });
  const [items, setItems] = useState(initial?.items?.length ? initial.items : [{ description:'', quantity:'', unit:'', unit_price:'' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { suppliersAPI.getAll().then(r => setSuppliers(r.data || [])).catch(() => {}); }, []);

  const addItem = () => setItems(prev => [...prev, { description:'', quantity:'', unit:'', unit_price:'' }]);
  const updateItem = (i, field, val) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) * Number(it.unit_price) || 0), 0);
  const grandTotal = subtotal * (1 + Number(form.tax_percent) / 100);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.supplier_id) { toast.error('Please select a supplier'); return; }
    const filledItems = items.filter(it => it.description?.trim());
    if (filledItems.length === 0) { toast.error('Add at least one line item'); return; }
    setLoading(true);
    try {
      if (initial?.id) await purchaseOrdersAPI.update(initial.id, { ...form, project_id: projectId, items });
      else await purchaseOrdersAPI.create({ ...form, project_id: projectId, items });
      toast.success(initial?.id ? 'Purchase order updated!' : 'Purchase order created!'); onSave();
    }
    catch (err) { toast.error(err?.response?.data?.message || (initial?.id ? 'Failed to update PO' : 'Failed to create PO')); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Purchase Order' : 'Create Purchase Order'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="form-group sm:col-span-2">
                <label className="label">Supplier *</label>
                <select className="select" value={form.supplier_id} onChange={e => setForm(f=>({...f,supplier_id:e.target.value}))} required>
                  <option value="">Select supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Delivery Date</label>
                <input type="date" className="input" value={form.expected_delivery} onChange={e => setForm(f=>({...f,expected_delivery:e.target.value}))} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Line Items</label>
                <button type="button" className="btn-ghost btn-sm" onClick={addItem}><Plus className="w-3 h-3" />Add Item</button>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center">
                    <input className="input col-span-2 sm:col-span-4 text-xs" placeholder="Description" value={item.description} onChange={e => updateItem(i,'description',e.target.value)} />
                    <input className="input col-span-1 sm:col-span-2 text-xs" placeholder="Qty" type="number" value={item.quantity} onChange={e => updateItem(i,'quantity',e.target.value)} />
                    <input className="input col-span-1 sm:col-span-2 text-xs" placeholder="Unit" value={item.unit} onChange={e => updateItem(i,'unit',e.target.value)} />
                    <input className="input col-span-1 sm:col-span-2 text-xs" placeholder="Unit Price" type="number" value={item.unit_price} onChange={e => updateItem(i,'unit_price',e.target.value)} />
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-between gap-1">
                      <span className="text-xs font-medium text-primary">₹{((Number(item.quantity)||0)*(Number(item.unit_price)||0)).toLocaleString('en-IN')}</span>
                      {items.length > 1 && <button type="button" onClick={() => removeItem(i)}><X className="w-3 h-3 text-slate-400" /></button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Tax %</label>
                <input type="number" className="input" value={form.tax_percent} onChange={e => setForm(f=>({...f,tax_percent:e.target.value}))} />
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-right">
                <p className="text-xs text-slate-500">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500">Tax ({form.tax_percent}%): ₹{(subtotal*Number(form.tax_percent)/100).toLocaleString('en-IN')}</p>
                <p className="text-base font-bold text-primary">Grand Total: ₹{grandTotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="label">Notes</label>
              <textarea className="textarea" rows={2} value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} placeholder="Optional notes..." />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : initial?.id ? 'Save Changes' : 'Create PO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PurchaseOrdersPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pos, setPOs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingPO, setEditingPO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => purchaseOrdersAPI.getByProject(id).then(r => setPOs(r.data || [])).catch(err => setError(err.response?.data?.message || 'Failed to load POs')).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const filtered = statusFilter === 'All' ? pos : pos.filter(p => p.status === statusFilter);

  const approve = async (poId) => {
    try { await purchaseOrdersAPI.approve(poId, {}); toast.success('PO approved!'); load(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to approve PO'); }
  };
  const reject = async (poId) => {
    try { await purchaseOrdersAPI.reject(poId, { notes: 'Rejected' }); toast.success('PO rejected'); load(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to reject PO'); }
  };
  const editPO = async (poId) => {
    try {
      const { data } = await purchaseOrdersAPI.getById(poId);
      setEditingPO(data);
      setShowModal(true);
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to load PO'); }
  };

  if (loading) return <div className="p-6 flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="p-6"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-subtitle">{pos.length} purchase orders</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" />Create PO</button>
        )}
      </div>

      {/* Status filter — wraps on mobile */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', ...PO_STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded text-xs font-medium ${statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* MOBILE: PO cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-slate-400"><Package className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No purchase orders</p></div>
        ) : filtered.map(po => (
          <div key={po.id} className="card p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono font-semibold text-primary text-sm">{po.po_number}</p>
                <p className="text-xs text-slate-500 mt-0.5">{po.supplier_name}</p>
              </div>
              <span className={`${STATUS_COLORS[po.status]} badge flex-shrink-0`}>{po.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-slate-400">Total</p><p className="font-bold text-primary">₹{Number(po.grand_total).toLocaleString('en-IN')}</p></div>
              <div><p className="text-slate-400">Delivery</p><p className="font-medium text-slate-700">{po.expected_delivery || '—'}</p></div>
            </div>
            <div className="flex gap-2 pt-1">
              <Link to={`/projects/${id}/purchase-orders/${po.id}`} className="btn-secondary btn-sm flex-1 justify-center">
                <ExternalLink className="w-3 h-3" />View
              </Link>
              {po.status === 'Draft' && (user?.role === 'admin' || user?.role === 'manager') && (
                <>
                  <button className="btn-success btn-sm flex-1 justify-center" onClick={() => approve(po.id)}><CheckCircle className="w-3 h-3" />Approve</button>
                  <button className="btn-secondary btn-sm flex-1 justify-center" onClick={() => editPO(po.id)}><Pencil className="w-3 h-3" />Edit</button>
                  <button className="btn-danger btn-sm flex-1 justify-center" onClick={() => reject(po.id)}><XCircle className="w-3 h-3" />Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP: table */}
      <div className="hidden md:block table-wrapper">
        <table className="table">
          <thead><tr>
            <th>PO Number</th><th>Supplier</th><th>Status</th><th>Grand Total</th><th>Delivery</th><th>Created</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(po => (
              <tr key={po.id}>
                <td className="font-mono font-medium text-primary">{po.po_number}</td>
                <td className="text-slate-700">{po.supplier_name}</td>
                <td><span className={`${STATUS_COLORS[po.status]} badge`}>{po.status}</span></td>
                <td className="font-semibold text-primary">₹{Number(po.grand_total).toLocaleString('en-IN')}</td>
                <td className="text-slate-500 text-xs">{po.expected_delivery || '—'}</td>
                <td className="text-slate-500 text-xs">{po.created_at}</td>
                <td>
                  <div className="flex gap-2">
                    <Link to={`/projects/${id}/purchase-orders/${po.id}`} className="btn-secondary btn-sm">View</Link>
                    {po.status === 'Draft' && (user?.role === 'admin' || user?.role === 'manager') && (
                      <>
                        <button className="btn-success btn-sm" onClick={() => approve(po.id)} title="Approve"><CheckCircle className="w-3 h-3" /></button>
                        <button className="btn-secondary btn-sm" onClick={() => editPO(po.id)} title="Edit"><Pencil className="w-3 h-3" /></button>
                        <button className="btn-danger btn-sm" onClick={() => reject(po.id)} title="Reject"><XCircle className="w-3 h-3" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <CreatePOModal projectId={id} initial={editingPO}
        onClose={() => { setShowModal(false); setEditingPO(null); }}
        onSave={() => { setShowModal(false); setEditingPO(null); load(); }} />}
    </div>
  );
}
