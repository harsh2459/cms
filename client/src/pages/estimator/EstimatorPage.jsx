import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { estimatorAPI, materialCatalogAPI } from '../../api';
import {
  Sparkles, Loader2, Trash2, Plus, Save, FileText, Pencil,
  Package, HardHat, Clock, IndianRupee, History, Settings2, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';

function emptyMaterial() {
  return { name: '', unit: '', quantity: 0, unit_price: 0, total_cost: 0 };
}
function emptyLabor() {
  return { role: '', count: 0, duration_days: 0, daily_wage: 0, total_cost: 0 };
}

const PROJECT_TYPES = ['Residential House', 'Apartment / Flat', 'Commercial Office', 'Shop / Retail', 'Warehouse', 'Other'];
const FINISH_LEVELS = ['Basic', 'Standard', 'Premium', 'Luxury'];

// Block letters/symbols in numeric inputs (allow digits, dot, backspace, arrows, tab, delete)
const blockNonNumeric = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
};

function buildDescription(form) {
  const parts = [
    `${form.projectType} construction project`,
    form.area && `built-up area of ${form.area} sqft`,
    form.floors && `${form.floors} floor${Number(form.floors) > 1 ? 's' : ''}`,
    form.bedrooms && `${form.bedrooms} bedroom${Number(form.bedrooms) > 1 ? 's' : ''}`,
    form.bathrooms && `${form.bathrooms} bathroom${Number(form.bathrooms) > 1 ? 's' : ''}`,
    form.finish && `${form.finish.toLowerCase()} finish quality`,
  ].filter(Boolean);
  let desc = parts.join(', ') + '.';
  if (form.additionalDetails?.trim()) {
    desc += ` Additional details: ${form.additionalDetails.trim()}`;
  }
  return desc;
}

function MaterialCatalogModal({ catalog, onClose, onChange }) {
  const [form, setForm] = useState({ name: '', unit: '', unit_price: '' });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const addItem = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.unit.trim()) {
      toast.error('Name and unit are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), unit: form.unit.trim(), unit_price: Number(form.unit_price) || 0 };
      if (editing?.id) await materialCatalogAPI.update(editing.id, payload);
      else await materialCatalogAPI.create(payload);
      toast.success(editing?.id ? 'Catalog material updated!' : 'Material added to catalog!');
      setForm({ name: '', unit: '', unit_price: '' });
      setEditing(null);
      onChange();
    } catch {
      toast.error(editing?.id ? 'Failed to update material' : 'Failed to add material');
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await materialCatalogAPI.delete(id);
      toast.success('Removed from catalog');
      onChange();
    } catch {
      toast.error('Failed to remove material');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary flex items-center gap-2">
            <Package className="w-4 h-4" /> Manage Material Catalog
          </h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <div className="modal-body space-y-4">
          <form onSubmit={addItem} className="grid grid-cols-4 gap-2 items-end">
            <div className="form-group col-span-2">
              <label className="label">Material Name</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Cement" />
            </div>
            <div className="form-group">
              <label className="label">Unit</label>
              <input className="input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="bags" />
            </div>
            <div className="form-group">
              <label className="label">Price (₹)</label>
              <input type="number" min="0" step="0.01" className="input" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} placeholder="350" />
            </div>
            <button type="submit" className="btn-primary col-span-4" disabled={saving}>
              <Plus className="w-4 h-4" /> {editing?.id ? 'Save Material' : 'Add Material'}
            </button>
            {editing?.id && <button type="button" className="btn-secondary col-span-4" onClick={() => { setEditing(null); setForm({ name: '', unit: '', unit_price: '' }); }}>Cancel Edit</button>}
          </form>

          <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100">
            {catalog.length === 0 ? (
              <p className="text-sm text-slate-400 p-4 text-center">No materials in catalog yet.</p>
            ) : catalog.map(c => (
              <div key={c.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <div>
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <span className="text-slate-400 ml-2">{c.unit} · ₹{Number(c.unit_price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(c); setForm({ name: c.name, unit: c.unit, unit_price: c.unit_price }); }} className="btn-icon btn-ghost text-accent"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => removeItem(c.id)} className="btn-icon btn-ghost text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default function EstimatorPage() {
  const [form, setForm] = useState({
    projectType: PROJECT_TYPES[0],
    area: '',
    floors: '',
    bedrooms: '',
    bathrooms: '',
    finish: FINISH_LEVELS[1],
    additionalDetails: '',
  });
  const setField = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const [generating, setGenerating] = useState(false);

  const [estimate, setEstimate] = useState(null); // current loaded/generated estimate
  const [materials, setMaterials] = useState([]);
  const [labor, setLabor] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [catalog, setCatalog] = useState([]);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [converting, setConverting] = useState(false);
  const navigate = useNavigate();

  const loadHistory = useCallback(() => {
    setHistoryLoading(true);
    estimatorAPI.getAll()
      .then(res => setHistory(res.data || []))
      .catch(() => toast.error('Failed to load past estimates'))
      .finally(() => setHistoryLoading(false));
  }, []);

  const loadCatalog = useCallback(() => {
    materialCatalogAPI.getAll()
      .then(res => setCatalog(res.data || []))
      .catch(() => toast.error('Failed to load material catalog'));
  }, []);

  useEffect(() => { loadHistory(); loadCatalog(); }, [loadHistory, loadCatalog]);

  const applyEstimate = (est) => {
    setEstimate(est);
    setMaterials(est.materials_json || []);
    setLabor(est.labor_json || []);
    setDirty(false);
  };

  const generate = async (e) => {
    e.preventDefault();
    if (!form.area || !form.floors) {
      toast.error('Please enter at least the area and number of floors');
      return;
    }
    setGenerating(true);
    try {
      const title = `${form.projectType} — ${form.area} sqft`;
      const description = buildDescription(form);
      const res = await estimatorAPI.estimate({ title, description });
      applyEstimate(res.data);
      toast.success('Estimate generated!');
      loadHistory();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate estimate');
    } finally {
      setGenerating(false);
    }
  };

  const openPast = (id) => {
    estimatorAPI.getById(id)
      .then(res => applyEstimate(res.data))
      .catch(() => toast.error('Failed to load estimate'));
  };

  // ── Materials editing ──────────────────────────────────────────────
  const updateMaterial = (idx, field, value) => {
    setMaterials(prev => prev.map((m, i) => {
      if (i !== idx) return m;
      let updated = { ...m, [field]: field === 'name' || field === 'unit' ? value : Number(value) };
      // Picking a known catalog material auto-fills its unit + price
      if (field === 'name') {
        const match = catalog.find(c => c.name === value);
        if (match) {
          updated = { ...updated, unit: match.unit, unit_price: Number(match.unit_price) };
        }
      }
      updated.total_cost = Number(updated.quantity) * Number(updated.unit_price);
      return updated;
    }));
    setDirty(true);
  };
  const addMaterial = () => { setMaterials(prev => [...prev, emptyMaterial()]); setDirty(true); };
  const removeMaterial = (idx) => { setMaterials(prev => prev.filter((_, i) => i !== idx)); setDirty(true); };

  // ── Labor editing ───────────────────────────────────────────────────
  const updateLabor = (idx, field, value) => {
    setLabor(prev => prev.map((l, i) => {
      if (i !== idx) return l;
      const updated = { ...l, [field]: field === 'role' ? value : Number(value) };
      updated.total_cost = Number(updated.count) * Number(updated.duration_days) * Number(updated.daily_wage);
      return updated;
    }));
    setDirty(true);
  };
  const addLabor = () => { setLabor(prev => [...prev, emptyLabor()]); setDirty(true); };
  const removeLabor = (idx) => { setLabor(prev => prev.filter((_, i) => i !== idx)); setDirty(true); };

  const materialsTotal = materials.reduce((s, m) => s + Number(m.total_cost || 0), 0);
  const laborTotal = labor.reduce((s, l) => s + Number(l.total_cost || 0), 0);
  const liveCost = materialsTotal + laborTotal;

  const saveChanges = async () => {
    if (!estimate) return;
    setSaving(true);
    try {
      const res = await estimatorAPI.update(estimate.id, { materials, labor });
      applyEstimate(res.data);
      toast.success('Estimate updated!');
      loadHistory();
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const convertToProject = async () => {
    if (!estimate) return;
    setConverting(true);
    try {
      const res = await estimatorAPI.convertToProject(estimate.id);
      toast.success('Successfully converted to project!');
      navigate(`/projects/${res.data.project_id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to convert to project');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" /> AI Project Estimator
          </h1>
          <p className="page-subtitle">Describe your project in plain language — AI calculates cost, timeline, materials, and labor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form + Results */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={generate} className="card space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="form-group col-span-2 md:col-span-1">
                <label className="label">Project Type *</label>
                <select className="input" value={form.projectType} onChange={e => setField('projectType', e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Area (sqft) *</label>
                <input type="number" min="0" className="input" value={form.area}
                  onChange={e => setField('area', e.target.value)} placeholder="e.g. 1800" required />
              </div>
              <div className="form-group">
                <label className="label">Floors *</label>
                <input type="number" min="1" className="input" value={form.floors}
                  onChange={e => setField('floors', e.target.value)} placeholder="e.g. 2" required />
              </div>
              <div className="form-group">
                <label className="label">Bedrooms</label>
                <input type="number" min="0" className="input" value={form.bedrooms}
                  onChange={e => setField('bedrooms', e.target.value)} placeholder="e.g. 3" />
              </div>
              <div className="form-group">
                <label className="label">Bathrooms</label>
                <input type="number" min="0" className="input" value={form.bathrooms}
                  onChange={e => setField('bathrooms', e.target.value)} placeholder="e.g. 2" />
              </div>
              <div className="form-group">
                <label className="label">Finish Quality</label>
                <select className="input" value={form.finish} onChange={e => setField('finish', e.target.value)}>
                  {FINISH_LEVELS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="label">Additional Details (optional)</label>
              <textarea className="textarea" rows={3} value={form.additionalDetails}
                onChange={e => setField('additionalDetails', e.target.value)}
                placeholder="e.g. location, structure type (RCC frame), specific requirements, etc." />
            </div>
            <button type="submit" className="btn-primary" disabled={generating}>
              {generating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> AI is analyzing your project...</>
                : <><Sparkles className="w-4 h-4" /> Generate Estimate</>}
            </button>
          </form>

          {estimate && estimate.status === 'completed' && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-sm bg-blue-50/50 border-blue-100">
                  <p className="text-sm text-blue-600 font-medium mb-1 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" /> Estimated Cost
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    ₹{liveCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="card-sm bg-purple-50/50 border-purple-100">
                  <p className="text-sm text-purple-600 font-medium mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Estimated Timeline
                  </p>
                  <p className="text-2xl font-bold text-slate-800">{estimate.estimated_days} days</p>
                </div>
              </div>

              {/* Materials table */}
              <div className="card p-0 overflow-hidden border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Package className="w-4 h-4" /> Materials
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowCatalogModal(true)} className="btn-secondary py-1 px-2 text-xs">
                      <Settings2 className="w-3 h-3" /> Manage Materials
                    </button>
                    <button onClick={addMaterial} className="btn-secondary py-1 px-2 text-xs"><Plus className="w-3 h-3" /> Add</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <colgroup>
                      <col className="w-[35%]" />
                      <col className="w-[15%]" />
                      <col className="w-[12%]" />
                      <col className="w-[18%]" />
                      <col className="w-[16%]" />
                      <col className="w-[4%]" />
                    </colgroup>
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Unit</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Unit Price (₹)</th>
                        <th className="px-3 py-2 text-right">Total (₹)</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {materials.length === 0 ? (
                        <tr><td colSpan="6" className="p-6 text-center text-slate-400">No materials yet.</td></tr>
                      ) : materials.map((m, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">
                            <input className="input py-1 text-sm w-full" value={m.name} list="material-catalog-options"
                              onChange={e => updateMaterial(idx, 'name', e.target.value)}
                              placeholder="Type or pick from catalog" />
                          </td>
                          <td className="px-3 py-2">
                            <input className="input py-1 text-sm w-full" value={m.unit}
                              onChange={e => updateMaterial(idx, 'unit', e.target.value)} placeholder="e.g. bags" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" step="0.01" className="input py-1 text-sm w-full text-right" value={m.quantity}
                              onChange={e => updateMaterial(idx, 'quantity', e.target.value)} onKeyDown={blockNonNumeric} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" step="0.01" className="input py-1 text-sm w-full text-right" value={m.unit_price}
                              onChange={e => updateMaterial(idx, 'unit_price', e.target.value)} onKeyDown={blockNonNumeric} />
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-slate-700 whitespace-nowrap">
                            ₹{Number(m.total_cost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={() => removeMaterial(idx)} className="btn-icon btn-ghost text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {materials.length > 0 && (
                      <tfoot>
                        <tr className="bg-slate-50">
                          <td colSpan="4" className="px-3 py-2 text-right font-semibold text-slate-600">Materials Subtotal</td>
                          <td className="px-3 py-2 text-right font-bold text-primary">₹{materialsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* Labor table */}
              <div className="card p-0 overflow-hidden border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <HardHat className="w-4 h-4" /> Labor
                  </h3>
                  <button onClick={addLabor} className="btn-secondary py-1 px-2 text-xs"><Plus className="w-3 h-3" /> Add</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <colgroup>
                      <col className="w-[30%]" />
                      <col className="w-[12%]" />
                      <col className="w-[15%]" />
                      <col className="w-[18%]" />
                      <col className="w-[21%]" />
                      <col className="w-[4%]" />
                    </colgroup>
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2 text-left">Role</th>
                        <th className="px-3 py-2 text-right">Count</th>
                        <th className="px-3 py-2 text-right">Duration (days)</th>
                        <th className="px-3 py-2 text-right">Daily Wage (₹)</th>
                        <th className="px-3 py-2 text-right">Total (₹)</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {labor.length === 0 ? (
                        <tr><td colSpan="6" className="p-6 text-center text-slate-400">No labor rows yet.</td></tr>
                      ) : labor.map((l, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">
                            <input className="input py-1 text-sm w-full" value={l.role}
                              onChange={e => updateLabor(idx, 'role', e.target.value)} placeholder="e.g. Mason" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" className="input py-1 text-sm w-full text-right" value={l.count}
                              onChange={e => updateLabor(idx, 'count', e.target.value)} onKeyDown={blockNonNumeric} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" className="input py-1 text-sm w-full text-right" value={l.duration_days}
                              onChange={e => updateLabor(idx, 'duration_days', e.target.value)} onKeyDown={blockNonNumeric} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" step="0.01" className="input py-1 text-sm w-full text-right" value={l.daily_wage}
                              onChange={e => updateLabor(idx, 'daily_wage', e.target.value)} onKeyDown={blockNonNumeric} />
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-slate-700 whitespace-nowrap">
                            ₹{Number(l.total_cost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={() => removeLabor(idx)} className="btn-icon btn-ghost text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {labor.length > 0 && (
                      <tfoot>
                        <tr className="bg-slate-50">
                          <td colSpan="3" className="px-3 py-2 text-right font-semibold text-slate-600">Labor Subtotal</td>
                          <td></td>
                          <td className="px-3 py-2 text-right font-bold text-primary">₹{laborTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {dirty && (
                  <button onClick={saveChanges} className="btn-primary" disabled={saving || converting}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                  </button>
                )}
                <button onClick={convertToProject} className="btn-success" disabled={converting || saving}>
                  {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <HardHat className="w-4 h-4" />} Create Project from Estimate
                </button>
              </div>

              {/* Summary report */}
              <div className="card">
                <h3 className="font-semibold text-primary flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" /> AI Summary Report
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{estimate.summary}</p>
              </div>
            </>
          )}

          {estimate && estimate.status === 'failed' && (
            <div className="card border-red-200 bg-red-50/50">
              <p className="text-sm text-danger font-medium">Estimate generation failed</p>
              <p className="text-xs text-red-600 mt-1">{estimate.error_message}</p>
            </div>
          )}
        </div>

        {/* History sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <History className="w-4 h-4" /> Past Estimates
            </h3>
            {historyLoading ? (
              <CardSkeleton count={2} />
            ) : history.length === 0 ? (
              <p className="text-sm text-slate-400">No estimates yet.</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {history.map(h => (
                  <button
                    key={h.id}
                    onClick={() => openPast(h.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      estimate?.id === h.id ? 'border-accent bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-800 truncate">{h.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`badge text-[10px] ${h.status === 'completed' ? 'badge-green' : 'badge-red'}`}>
                        {h.status}
                      </span>
                      {h.estimated_cost && (
                        <span className="text-xs text-slate-500">₹{Number(h.estimated_cost).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(h.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <datalist id="material-catalog-options">
        {catalog.map(c => <option key={c.id} value={c.name} />)}
      </datalist>

      {showCatalogModal && (
        <MaterialCatalogModal
          catalog={catalog}
          onClose={() => setShowCatalogModal(false)}
          onChange={loadCatalog}
        />
      )}
    </div>
  );
}
