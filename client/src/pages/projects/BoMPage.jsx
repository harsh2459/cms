import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bomAPI } from '../../api';
import { Plus, X, ListChecks, AlertCircle, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';

function AddBoMModal({ projectId, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? {
    material_name: initial.material_name || '', unit: initial.unit || '', planned_qty: initial.planned_qty || '',
    actual_qty_used: initial.actual_qty_used || 0, unit_price: initial.unit_price || '', notes: initial.notes || ''
  } : { material_name: '', unit: '', planned_qty: '', unit_price: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initial?.id) await bomAPI.update(initial.id, form);
      else await bomAPI.create({ ...form, project_id: projectId });
      toast.success(initial?.id ? 'BoM item updated!' : 'BoM item added!');
      onSave();
    } catch { toast.error(initial?.id ? 'Failed to update item' : 'Failed to add item'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit BoM Item' : 'Add to Bill of Materials'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body grid grid-cols-2 gap-3">
            <div className="form-group col-span-2">
              <label className="label">Material Name *</label>
              <input className="input" value={form.material_name} onChange={e => setForm(f=>({...f,material_name:e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="label">Unit *</label>
              <input className="input" placeholder="e.g. kg, bags" value={form.unit} onChange={e => setForm(f=>({...f,unit:e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="label">Planned Quantity *</label>
              <input type="number" step="0.01" className="input" value={form.planned_qty} onChange={e => setForm(f=>({...f,planned_qty:e.target.value}))} required />
            </div>
            <div className="form-group col-span-2">
              <label className="label">Est. Price per Unit (₹) *</label>
              <input type="number" step="0.01" className="input" value={form.unit_price} onChange={e => setForm(f=>({...f,unit_price:e.target.value}))} required />
            </div>
            <div className="form-group col-span-2">
              <label className="label">Notes</label>
              <textarea className="textarea" rows={2} value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{initial?.id ? 'Save Changes' : 'Add Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UpdateUsageModal({ item, onClose, onSave }) {
  const [qty, setQty] = useState(item.actual_qty_used);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bomAPI.update(item.id, { actual_qty_used: qty, notes: item.notes });
      toast.success('Usage updated!');
      onSave();
    } catch { toast.error('Failed to update usage'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-sm animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Update Actual Usage</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <p className="text-sm text-slate-500 mb-3">Material: <strong className="text-slate-800">{item.material_name}</strong></p>
            <div className="form-group">
              <label className="label">Actual Quantity Used ({item.unit})</label>
              <input type="number" step="0.01" className="input" value={qty} onChange={e => setQty(e.target.value)} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BoMPage() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDetails, setEditingDetails] = useState(null);

  const loadData = () => {
    setLoading(true);
    bomAPI.getAll({ project_id: id })
      .then(res => setItems(res.data || []))
      .catch(() => toast.error('Failed to load Bill of Materials'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const totalPlannedCost = items.reduce((acc, i) => acc + (Number(i.planned_qty) * Number(i.unit_price)), 0);
  const totalActualCost = items.reduce((acc, i) => acc + (Number(i.actual_qty_used) * Number(i.unit_price)), 0);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><ListChecks className="w-6 h-6 text-primary" /> Bill of Materials (BoM)</h1>
          <p className="page-subtitle">Track planned vs actual material usage to identify waste</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card-sm bg-blue-50/50 border-blue-100">
          <p className="text-sm text-blue-600 font-medium mb-1">Estimated Total Material Cost</p>
          <p className="text-2xl font-bold text-slate-800">₹{totalPlannedCost.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
        </div>
        <div className="card-sm bg-purple-50/50 border-purple-100">
          <p className="text-sm text-purple-600 font-medium mb-1">Actual Material Cost (Based on Usage)</p>
          <p className="text-2xl font-bold text-slate-800">₹{totalActualCost.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
        </div>
      </div>

      {loading ? <CardSkeleton count={3} /> : (
        <div className="card p-0 overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Material Name</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Planned Qty</th>
                  <th className="px-4 py-3 text-right">Actual Qty</th>
                  <th className="px-4 py-3 text-right">Variance</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-slate-400">No materials planned yet.</td></tr>
                ) : items.map(item => {
                  const planned = Number(item.planned_qty);
                  const actual = Number(item.actual_qty_used);
                  const variance = actual - planned;
                  const variancePct = planned > 0 ? (variance / planned) * 100 : 0;
                  const overage = variance > 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{item.material_name}</td>
                      <td className="px-4 py-3 text-right text-slate-600">₹{Number(item.unit_price).toLocaleString('en-IN')} / {item.unit}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{planned.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">{actual.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium ${overage ? 'text-danger' : variance < 0 ? 'text-success' : 'text-slate-500'}`}>
                          {overage ? '+' : ''}{variance.toLocaleString('en-IN')} ({variancePct > 0 ? '+' : ''}{variancePct.toFixed(1)}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {overage ? (
                          <span className="badge badge-red inline-flex gap-1"><AlertCircle className="w-3 h-3"/> Over limit</span>
                        ) : actual === 0 ? (
                          <span className="badge badge-gray">Not started</span>
                        ) : (
                          <span className="badge badge-green">On track</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingDetails(item); setShowAddModal(true); }} className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1"><Pencil className="w-3 h-3" /> Edit</button>
                          <button onClick={() => setEditingItem(item)} className="text-accent hover:text-primary text-sm font-medium">Update Usage</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && <AddBoMModal projectId={id} initial={editingDetails}
        onClose={() => { setShowAddModal(false); setEditingDetails(null); }}
        onSave={() => { setShowAddModal(false); setEditingDetails(null); loadData(); }} />}
      {editingItem && <UpdateUsageModal item={editingItem} onClose={() => setEditingItem(null)} onSave={() => { setEditingItem(null); loadData(); }} />}
    </div>
  );
}
