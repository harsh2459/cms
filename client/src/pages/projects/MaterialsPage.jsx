import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { materialsAPI } from '../../api';
import {
  Plus, X, AlertTriangle, Package, RefreshCw,
  ArrowDownCircle, ArrowUpCircle, History, FileText,
  ChevronDown, ChevronUp, ExternalLink, Pencil
} from 'lucide-react';
import toast from 'react-hot-toast';

function AddMaterialModal({ projectId, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name || '', unit: initial.unit || '', qty_available: initial.qty_available || '',
    qty_used: initial.qty_used || 0, price_per_unit: initial.price_per_unit || '',
    low_stock_threshold: initial.low_stock_threshold || '10', supplier_name: initial.supplier_name || '',
    supplier_phone: initial.supplier_phone || ''
  } : {
    name: '', unit: '', qty_available: '', qty_used: 0, price_per_unit: '',
    low_stock_threshold: '10', supplier_name: '', supplier_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (initial?.id) await materialsAPI.update(initial.id, form);
      else await materialsAPI.create({ ...form, project_id: projectId });
      toast.success(initial?.id ? 'Material updated!' : 'Material added!'); onSave();
    }
    catch { toast.error(initial?.id ? 'Failed to update material' : 'Failed to add material'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Material' : 'Add Material'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group col-span-full">
              <label className="label">Material Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="label">Unit *</label>
              <input className="input" placeholder="kg / bags / pcs" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="label">{initial?.id ? 'Available Quantity' : 'Opening Quantity'}</label>
              <input type="number" min="0" step="0.01" className="input" value={form.qty_available} onChange={e => setForm(f => ({ ...f, qty_available: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">Price / Unit (₹) *</label>
              <input type="number" min="0" step="0.01" className="input" value={form.price_per_unit} onChange={e => setForm(f => ({ ...f, price_per_unit: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="label">Low Stock Alert at</label>
              <input type="number" min="0" className="input" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: e.target.value }))} />
            </div>
            <div className="form-group col-span-full">
              <label className="label">Supplier Name</label>
              <input className="input" value={form.supplier_name} onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))} />
            </div>
            <div className="form-group col-span-full">
              <label className="label">Supplier Phone</label>
              <input className="input" value={form.supplier_phone} onChange={e => setForm(f => ({ ...f, supplier_phone: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : initial?.id ? 'Save Changes' : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StockModal({ material, action, onClose, onSave }) {
  const [form, setForm] = useState({ qty: '', transaction_date: new Date().toISOString().split('T')[0], invoice_number: '', invoice_url: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const isUse = action === 'use';
  const submit = async (e) => {
    e.preventDefault();
    if (!form.qty || Number(form.qty) <= 0) { toast.error('Enter a valid quantity'); return; }
    if (isUse && Number(form.qty) > Number(material.qty_available)) { toast.error('Cannot use more than available stock'); return; }
    setLoading(true);
    try {
      const payload = { qty: form.qty, transaction_date: form.transaction_date, notes: form.notes || undefined, invoice_number: form.invoice_number || undefined, ...(isUse ? {} : { invoice_url: form.invoice_url || undefined }) };
      if (isUse) await materialsAPI.use(material.id, payload);
      else await materialsAPI.restock(material.id, payload);
      toast.success(isUse ? 'Stock usage logged!' : 'Restock recorded!'); onSave();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to update stock'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            {isUse ? <ArrowUpCircle className="w-5 h-5 text-accent" /> : <ArrowDownCircle className="w-5 h-5 text-success" />}
            <h3 className="font-semibold text-primary">{isUse ? 'Use Material' : 'Restock Material'}</h3>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body space-y-3">
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-slate-700">{material.name}</p>
              <p className="text-slate-500 mt-0.5">Available: <span className={`font-semibold ${isUse ? 'text-accent' : 'text-success'}`}>{Number(material.qty_available).toLocaleString('en-IN')} {material.unit}</span></p>
            </div>
            <div className="form-group">
              <label className="label">Quantity to {isUse ? 'Deduct' : 'Add'} ({material.unit}) *</label>
              <input type="number" step="0.01" min="0.01" className="input" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} max={isUse ? material.qty_available : undefined} required />
              {isUse && form.qty && Number(form.qty) > Number(material.qty_available) && <p className="text-xs text-danger mt-1">Exceeds available stock</p>}
            </div>
            <div className="form-group">
              <label className="label">Date *</label>
              <input type="date" className="input" value={form.transaction_date} onChange={e => setForm(f => ({ ...f, transaction_date: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="label">Invoice / Bill Number</label>
              <input className="input" placeholder="e.g. INV-2024-001" value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} />
            </div>
            {!isUse && (
              <div className="form-group">
                <label className="label">Invoice URL / Link</label>
                <input className="input" placeholder="https://..." value={form.invoice_url} onChange={e => setForm(f => ({ ...f, invoice_url: e.target.value }))} />
              </div>
            )}
            <div className="form-group">
              <label className="label">Notes</label>
              <input className="input" placeholder={isUse ? 'e.g. Used for foundation slab' : 'e.g. Received from TATA Steel'} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn-primary ${isUse ? '' : 'bg-success border-success hover:bg-success/90'}`} disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : isUse ? 'Confirm Usage' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransactionHistory({ transactions, materialName, onClose }) {
  const uses = transactions.filter(t => t.type === 'use');
  const restocks = transactions.filter(t => t.type === 'restock');
  const totalUsed = uses.reduce((s, t) => s + Number(t.quantity), 0);
  const totalRestocked = restocks.reduce((s, t) => s + Number(t.quantity), 0);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2 min-w-0">
            <History className="w-5 h-5 text-accent flex-shrink-0" />
            <h3 className="font-semibold text-primary truncate">History — {materialName}</h3>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost flex-shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <div className="modal-body">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-0.5">Total Used</p>
              <p className="text-lg font-bold text-danger">{totalUsed.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400">{uses.length} txn{uses.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-0.5">Total Restocked</p>
              <p className="text-lg font-bold text-success">{totalRestocked.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400">{restocks.length} txn{restocks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400"><History className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No transactions yet</p></div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {transactions.map(t => (
                <div key={t.id} className={`flex items-start gap-3 p-3 rounded-lg border ${t.type === 'use' ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
                  <div className={`mt-0.5 flex-shrink-0 ${t.type === 'use' ? 'text-danger' : 'text-success'}`}>
                    {t.type === 'use' ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${t.type === 'use' ? 'text-danger' : 'text-success'}`}>{t.type === 'use' ? '−' : '+'}{Number(t.quantity).toLocaleString('en-IN')} {t.unit}</span>
                      <span className="text-xs text-slate-400">{new Date(t.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {t.notes && <p className="text-xs text-slate-600 mt-0.5">{t.notes}</p>}
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {t.invoice_number && <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5"><FileText className="w-3 h-3" />{t.invoice_number}</span>}
                      {t.invoice_url && <a href={t.invoice_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline" onClick={e => e.stopPropagation()}><ExternalLink className="w-3 h-3" />View</a>}
                      <span className="text-xs text-slate-400">by {t.performed_by_name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer"><button className="btn-secondary" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}

// Mobile card for a single material
function MaterialCard({ m, rowTxns, last, isLow, usedPct, onHistory, onUse, onRestock }) {
  return (
    <div className={`card p-4 space-y-3 ${isLow ? 'border-l-4 border-l-danger' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-primary truncate">{m.name}</p>
            <p className="text-xs text-slate-400">{m.unit} · {m.supplier_name || 'No supplier'}</p>
          </div>
        </div>
        {isLow && <span className="badge badge-red flex-shrink-0">Low</span>}
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-2 text-center">
        <div>
          <p className="text-xs text-slate-400">Available</p>
          <p className={`font-bold text-sm ${isLow ? 'text-danger' : 'text-success'}`}>{Number(m.qty_available).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Used</p>
          <p className="font-bold text-sm text-slate-700">{Number(m.qty_used).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Price/Unit</p>
          <p className="font-bold text-sm text-slate-700">₹{Number(m.price_per_unit).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Stock usage</span><span>{usedPct}% used</span></div>
        <div className="progress-bar"><div className={`progress-fill ${isLow ? 'bg-danger' : 'bg-accent'}`} style={{ width: `${usedPct}%` }} /></div>
      </div>

      {last && (
        <p className="text-xs text-slate-500 flex items-center gap-1">
          {last.type === 'use' ? <ArrowUpCircle className="w-3 h-3 text-danger" /> : <ArrowDownCircle className="w-3 h-3 text-success" />}
          {last.type === 'use' ? 'Used' : 'Restocked'} on {new Date(last.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          {last.invoice_number && ` · ${last.invoice_number}`}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 pt-1">
        <button onClick={() => onHistory(m)} className="btn-secondary py-1.5 text-xs flex items-center justify-center gap-1">
          <History className="w-3 h-3" />{rowTxns.length > 0 ? rowTxns.length : ''}
        </button>
        <button onClick={() => onUse(m)} className="btn-secondary py-1.5 text-xs justify-center">Use</button>
        <button onClick={() => onRestock(m)} className="btn-primary bg-success border-success hover:bg-success/90 py-1.5 text-xs justify-center">Restock</button>
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  const { id: projectId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [stockAction, setStockAction] = useState(null);
  const [historyMaterial, setHistoryMaterial] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try { const mRes = await materialsAPI.getByProject(projectId); setMaterials(mRes.data || []); }
    catch { toast.error('Failed to load materials'); setLoading(false); return; }
    try { const tRes = await materialsAPI.getTransactions(projectId); setTransactions(tRes.data || []); }
    catch { setTransactions([]); }
    setLoading(false);
  }, [projectId]);

  useEffect(() => { reload(); }, [reload]);

  const filtered = materials.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = materials.filter(m => Number(m.qty_available) <= Number(m.low_stock_threshold));
  const txnsFor = (materialId) => transactions.filter(t => t.material_id === materialId);
  const lastTxn = (materialId) => transactions.find(t => t.material_id === materialId) || null;

  return (
    <div className="page-wrapper">
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">Material Inventory</h1>
          <p className="page-subtitle">{materials.length} materials tracked</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Add Material</button>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-card p-4 mb-5">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">Low Stock Alert</p>
            <p className="text-xs text-yellow-700">{lowStock.map(m => m.name).join(', ')} — below threshold</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input className="input" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400"><RefreshCw className="w-5 h-5 animate-spin mr-2" />Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><Package className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No materials found</p></div>
      ) : (
        <>
          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {filtered.map(m => {
              const total = Number(m.qty_available) + Number(m.qty_used);
              const usedPct = total > 0 ? Math.round((Number(m.qty_used) / total) * 100) : 0;
              const isLow = Number(m.qty_available) <= Number(m.low_stock_threshold);
              return (
                <MaterialCard
                  key={m.id}
                  m={m}
                  rowTxns={txnsFor(m.id)}
                  last={lastTxn(m.id)}
                  isLow={isLow}
                  usedPct={usedPct}
                  onHistory={setHistoryMaterial}
                  onUse={(mat) => setStockAction({ material: mat, action: 'use' })}
                  onRestock={(mat) => setStockAction({ material: mat, action: 'restock' })}
                />
              );
            })}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th></th><th>Material</th><th>Unit</th><th>Available</th>
                    <th>Used</th><th>Price/Unit</th><th>Supplier</th>
                    <th>Stock</th><th>Last Activity</th><th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => {
                    const total = Number(m.qty_available) + Number(m.qty_used);
                    const usedPct = total > 0 ? Math.round((Number(m.qty_used) / total) * 100) : 0;
                    const isLow = Number(m.qty_available) <= Number(m.low_stock_threshold);
                    const last = lastTxn(m.id);
                    const rowTxns = txnsFor(m.id);
                    const isExpanded = expandedRow === m.id;
                    return (
                      <>
                        <tr key={m.id} className={isExpanded ? 'bg-slate-50' : ''}>
                          <td className="w-8">
                            <button onClick={() => setExpandedRow(isExpanded ? null : m.id)} className="btn-icon btn-ghost w-6 h-6">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td><div className="flex items-center gap-2"><Package className="w-4 h-4 text-slate-400 flex-shrink-0" /><span className="font-medium text-primary">{m.name}</span></div></td>
                          <td className="text-slate-500">{m.unit}</td>
                          <td><span className={`font-semibold ${isLow ? 'text-danger' : 'text-success'}`}>{Number(m.qty_available).toLocaleString('en-IN')}</span>{isLow && <span className="badge badge-red ml-2">Low</span>}</td>
                          <td className="text-slate-600">{Number(m.qty_used).toLocaleString('en-IN')}</td>
                          <td className="text-slate-600">₹{Number(m.price_per_unit).toLocaleString('en-IN')}</td>
                          <td className="text-slate-500 text-xs">{m.supplier_name || '—'}</td>
                          <td className="w-32"><div className="progress-bar"><div className={`progress-fill ${isLow ? 'bg-danger' : 'bg-accent'}`} style={{ width: `${usedPct}%` }} /></div><p className="text-xs text-slate-400 mt-0.5">{usedPct}% used</p></td>
                          <td className="text-xs text-slate-500 min-w-[120px]">
                            {last ? (
                              <div>
                                <span className={`inline-flex items-center gap-1 font-medium ${last.type === 'use' ? 'text-danger' : 'text-success'}`}>
                                  {last.type === 'use' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                                  {last.type === 'use' ? 'Used' : 'Restocked'}
                                </span><br />
                                <span className="text-slate-400">{new Date(last.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}{last.invoice_number && ` · ${last.invoice_number}`}</span>
                              </div>
                            ) : <span className="text-slate-300">No activity</span>}
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => setHistoryMaterial(m)} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1"><History className="w-3 h-3" />{rowTxns.length > 0 ? rowTxns.length : ''}</button>
                              <button onClick={() => { setEditingMaterial(m); setShowAddModal(true); }} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1"><Pencil className="w-3 h-3" />Edit</button>
                              <button onClick={() => setStockAction({ material: m, action: 'use' })} className="btn-secondary py-1 px-2 text-xs">Use</button>
                              <button onClick={() => setStockAction({ material: m, action: 'restock' })} className="btn-primary bg-success border-success hover:bg-success/90 py-1 px-2 text-xs">Restock</button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${m.id}-exp`} className="bg-slate-50">
                            <td colSpan={10} className="px-6 pb-4 pt-1">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recent Transactions</p>
                              {rowTxns.length === 0 ? <p className="text-xs text-slate-400 py-2">No transactions yet.</p> : (
                                <div className="space-y-1.5">
                                  {rowTxns.slice(0, 8).map(t => (
                                    <div key={t.id} className="flex items-center gap-3 text-xs bg-white border border-slate-100 rounded-lg px-3 py-2 flex-wrap">
                                      <span className={`font-semibold ${t.type === 'use' ? 'text-danger' : 'text-success'}`}>{t.type === 'use' ? '−' : '+'}{Number(t.quantity).toLocaleString('en-IN')} {t.unit}</span>
                                      <span className={`badge text-[10px] ${t.type === 'use' ? 'badge-red' : 'badge-green'}`}>{t.type === 'use' ? 'Used' : 'Restock'}</span>
                                      <span className="text-slate-500">{new Date(t.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                      {t.invoice_number && <span className="flex items-center gap-1 text-slate-500 bg-slate-100 rounded px-1.5 py-0.5"><FileText className="w-3 h-3" />{t.invoice_number}</span>}
                                      {t.invoice_url && <a href={t.invoice_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent hover:underline" onClick={e => e.stopPropagation()}><ExternalLink className="w-3 h-3" />Invoice</a>}
                                      {t.notes && <span className="text-slate-400 truncate max-w-xs">{t.notes}</span>}
                                      <span className="ml-auto text-slate-400">by {t.performed_by_name}</span>
                                    </div>
                                  ))}
                                  {rowTxns.length > 8 && <button className="text-xs text-accent hover:underline mt-1" onClick={() => setHistoryMaterial(m)}>View all {rowTxns.length} →</button>}
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showAddModal && <AddMaterialModal projectId={projectId} initial={editingMaterial}
        onClose={() => { setShowAddModal(false); setEditingMaterial(null); }}
        onSave={() => { setShowAddModal(false); setEditingMaterial(null); reload(); }} />}
      {stockAction && <StockModal material={stockAction.material} action={stockAction.action} onClose={() => setStockAction(null)} onSave={() => { setStockAction(null); reload(); }} />}
      {historyMaterial && <TransactionHistory transactions={txnsFor(historyMaterial.id)} materialName={historyMaterial.name} onClose={() => setHistoryMaterial(null)} />}
    </div>
  );
}
