import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { safetyAPI } from '../../api';
import { Plus, ShieldAlert, CheckSquare, AlertTriangle, X, Clock, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';

const SEVERITY_COLORS = {
  Low: 'badge-blue', Medium: 'badge-yellow', High: 'badge-purple', Critical: 'badge-red'
};

function IncidentModal({ onClose, onSave, projectId, initial }) {
  const [form, setForm] = useState(initial ? {
    project_id: projectId, incident_date: initial.incident_date?.slice(0,10) || new Date().toISOString().split('T')[0],
    incident_type: initial.incident_type || 'Injury', description: initial.description || '', location_on_site: initial.location_on_site || '',
    severity: initial.severity || 'Low', workers_involved: initial.workers_involved || '',
    medical_attention_required: Boolean(initial.medical_attention_required), photo_url: initial.photo_url || '', status: initial.status || 'Open'
  } : {
    project_id: projectId, incident_date: new Date().toISOString().split('T')[0],
    incident_type: 'Injury', description: '', location_on_site: '', severity: 'Low',
    workers_involved: '', medical_attention_required: false, photo_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initial?.id) await safetyAPI.updateIncident(initial.id, form);
      else await safetyAPI.createIncident(form);
      toast.success(initial?.id ? 'Incident updated successfully' : 'Incident reported successfully');
      onSave();
    } catch (err) {
      toast.error(initial?.id ? 'Failed to update incident' : 'Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-lg animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-danger" /> {initial?.id ? 'Edit Incident' : 'Report Incident'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Date *</label>
              <input type="date" className="input" value={form.incident_date} onChange={e => setForm(f => ({...f, incident_date: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="label">Type *</label>
              <select className="select" value={form.incident_type} onChange={e => setForm(f => ({...f, incident_type: e.target.value}))}>
                {['Injury', 'Near Miss', 'Property Damage', 'Fire', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group col-span-2">
              <label className="label">Description *</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} required placeholder="What happened?" />
            </div>
            <div className="form-group col-span-2">
              <label className="label">Location on Site</label>
              <input type="text" className="input" value={form.location_on_site} onChange={e => setForm(f => ({...f, location_on_site: e.target.value}))} placeholder="e.g. 3rd Floor scaffolding" />
            </div>
            <div className="form-group">
              <label className="label">Severity *</label>
              <select className="select" value={form.severity} onChange={e => setForm(f => ({...f, severity: e.target.value}))}>
                {['Low', 'Medium', 'High', 'Critical'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {initial?.id && <div className="form-group"><label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                {['Open','Investigating','Closed'].map(t => <option key={t}>{t}</option>)}
              </select></div>}
            <div className="form-group flex flex-col justify-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input type="checkbox" className="rounded border-slate-300 text-danger focus:ring-danger" 
                  checked={form.medical_attention_required} onChange={e => setForm(f => ({...f, medical_attention_required: e.target.checked}))} />
                Medical Attention Required
              </label>
            </div>
            <div className="form-group col-span-2">
              <label className="label">Workers Involved</label>
              <input type="text" className="input" value={form.workers_involved} onChange={e => setForm(f => ({...f, workers_involved: e.target.value}))} placeholder="Names of workers involved" />
            </div>
          </div>
          <div className="modal-footer border-t border-slate-100 p-5 mt-2 flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-danger" disabled={loading}>{loading ? 'Saving...' : initial?.id ? 'Save Changes' : 'Report Incident'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChecklistModal({ onClose, onSave, projectId, initial }) {
  const [form, setForm] = useState(initial ? {
    project_id: projectId, checklist_date: initial.checklist_date?.slice(0,10) || new Date().toISOString().split('T')[0],
    ppe_compliance: Boolean(initial.ppe_compliance), scaffolding_safe: Boolean(initial.scaffolding_safe), electrical_safe: Boolean(initial.electrical_safe),
    fire_exits_clear: Boolean(initial.fire_exits_clear), first_aid_available: Boolean(initial.first_aid_available), signage_in_place: Boolean(initial.signage_in_place), notes: initial.notes || ''
  } : {
    project_id: projectId, checklist_date: new Date().toISOString().split('T')[0],
    ppe_compliance: false, scaffolding_safe: false, electrical_safe: false,
    fire_exits_clear: false, first_aid_available: false, signage_in_place: false, notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initial?.id) await safetyAPI.updateChecklist(initial.id, form);
      else await safetyAPI.createChecklist(form);
      toast.success(initial?.id ? 'Checklist updated successfully' : 'Checklist logged successfully');
      onSave();
    } catch (err) {
      toast.error(initial?.id ? 'Failed to update checklist' : 'Failed to log checklist');
    } finally {
      setLoading(false);
    }
  };

  const checks = [
    { key: 'ppe_compliance', label: 'PPE Compliance (Helmets, Vests)' },
    { key: 'scaffolding_safe', label: 'Scaffolding & Ladders Safe' },
    { key: 'electrical_safe', label: 'Electrical Wires Secured' },
    { key: 'fire_exits_clear', label: 'Fire Exits & Pathways Clear' },
    { key: 'first_aid_available', label: 'First Aid Kit Available' },
    { key: 'signage_in_place', label: 'Safety Signage in Place' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-lg animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary flex items-center gap-2"><CheckSquare className="w-5 h-5 text-success" /> {initial?.id ? 'Edit Safety Checklist' : 'Daily Safety Checklist'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group mb-4">
              <label className="label">Date *</label>
              <input type="date" className="input" value={form.checklist_date} onChange={e => setForm(f => ({...f, checklist_date: e.target.value}))} required />
            </div>
            
            <div className="space-y-3 mb-4 bg-slate-50  p-4 rounded-xl border border-slate-100 ">
              <h4 className="text-sm font-semibold text-slate-700  mb-2">Checklist Items</h4>
              {checks.map(c => (
                <label key={c.key} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-600  group-hover:text-primary transition-colors">{c.label}</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-success focus:ring-success transition-all" 
                    checked={form[c.key]} onChange={e => setForm(f => ({...f, [c.key]: e.target.checked}))} />
                </label>
              ))}
            </div>

            <div className="form-group">
              <label className="label">Notes / Discrepancies</label>
              <textarea className="textarea" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Any issues found?" />
            </div>
          </div>
          <div className="modal-footer border-t border-slate-100 p-5 mt-2 flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-success" disabled={loading}>{loading ? 'Saving...' : initial?.id ? 'Save Changes' : 'Save Checklist'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SafetyPage() {
  const { id: projectId } = useParams();
  const [incidents, setIncidents] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Incidents'); // Incidents or Checklists
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [editingChecklist, setEditingChecklist] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      safetyAPI.getIncidents({ project_id: projectId }),
      safetyAPI.getChecklists({ project_id: projectId })
    ]).then(([resIncidents, resChecklists]) => {
      setIncidents(resIncidents.data);
      setChecklists(resChecklists.data);
    }).catch(() => toast.error('Failed to load safety data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [projectId]);

  const updateIncidentStatus = async (id, status) => {
    try {
      await safetyAPI.updateIncident(id, { status });
      toast.success(`Incident marked as ${status}`);
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteIncident = async (id) => {
    if (!confirm('Delete this incident record?')) return;
    try { await safetyAPI.deleteIncident(id); toast.success('Incident deleted'); loadData(); }
    catch { toast.error('Failed to delete incident'); }
  };

  const handleDeleteChecklist = async (id) => {
    if (!confirm('Delete this safety checklist?')) return;
    try { await safetyAPI.deleteChecklist(id); toast.success('Checklist deleted'); loadData(); }
    catch { toast.error('Failed to delete checklist'); }
  };

  const fmtDate = (d) => {
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-primary  flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-danger" /> Safety & Incidents
          </h2>
          <p className="text-sm text-slate-500  mt-1">Track safety incidents and daily checklists</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm" onClick={() => setShowChecklistModal(true)}>
            <CheckSquare className="w-4 h-4 text-success" /> Daily Checklist
          </button>
          <button className="btn-danger text-sm" onClick={() => setShowIncidentModal(true)}>
            <AlertTriangle className="w-4 h-4" /> Report Incident
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200  mb-6">
        <button onClick={() => setActiveTab('Incidents')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Incidents' ? 'border-danger text-danger' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Incidents ({incidents.length})
        </button>
        <button onClick={() => setActiveTab('Checklists')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Checklists' ? 'border-success text-success' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Safety Checklists ({checklists.length})
        </button>
      </div>

      {loading ? <CardSkeleton count={3} /> : (
        <>
          {activeTab === 'Incidents' && (
            <div className="space-y-4">
              {incidents.length === 0 ? (
                <EmptyState icon={ShieldAlert} title="No Incidents Reported" message="Good job! No safety incidents have been reported for this project." actionLabel="Report Incident" onAction={() => setShowIncidentModal(true)} />
              ) : (
                incidents.map(inc => (
                  <div key={inc.id} className="card p-5 border-l-4" style={{ borderLeftColor: inc.severity === 'Critical' ? '#A02020' : inc.severity === 'High' ? '#7c3aed' : inc.severity === 'Medium' ? '#B07D00' : '#3A7BD5' }}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-primary  text-base">{inc.incident_type}</h3>
                          <span className={`${SEVERITY_COLORS[inc.severity]} badge`}>{inc.severity}</span>
                          <span className={`badge ${inc.status === 'Closed' ? 'badge-green' : inc.status === 'Investigating' ? 'badge-yellow' : 'badge-red'}`}>{inc.status}</span>
                          {inc.medical_attention_required && <span className="badge badge-red flex items-center gap-1"><Plus className="w-3 h-3"/> Medical</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 ">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {fmtDate(inc.incident_date)}</span>
                          <span>Reported by: {inc.reported_by_name}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingIncident(inc); setShowIncidentModal(true); }} className="btn-secondary btn-sm"><Pencil className="w-3 h-3" /> Edit</button>
                        {inc.status !== 'Closed' && inc.status === 'Open' && <button onClick={() => updateIncidentStatus(inc.id, 'Investigating')} className="btn-secondary btn-sm">Investigate</button>}
                        {inc.status !== 'Closed' && <button onClick={() => updateIncidentStatus(inc.id, 'Closed')} className="btn-success btn-sm">Mark Closed</button>}
                        <button onClick={() => handleDeleteIncident(inc.id)} className="btn-secondary btn-sm text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600  bg-slate-50  p-3 rounded-lg mb-3">
                      {inc.description}
                    </p>
                    {(inc.location_on_site || inc.workers_involved) && (
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 bg-white  border border-slate-100  p-3 rounded-lg">
                        {inc.location_on_site && <div><span className="font-medium text-slate-700 ">Location:</span> {inc.location_on_site}</div>}
                        {inc.workers_involved && <div><span className="font-medium text-slate-700 ">Involved:</span> {inc.workers_involved}</div>}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Checklists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {checklists.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState icon={CheckSquare} title="No Checklists Found" message="Daily safety checklists help ensure site safety." actionLabel="Add Checklist" onAction={() => setShowChecklistModal(true)} />
                </div>
              ) : (
                checklists.map(chk => {
                  const items = [
                    { k: 'ppe_compliance', l: 'PPE' }, { k: 'scaffolding_safe', l: 'Scaffolds' },
                    { k: 'electrical_safe', l: 'Electrical' }, { k: 'fire_exits_clear', l: 'Fire Exits' },
                    { k: 'first_aid_available', l: 'First Aid' }, { k: 'signage_in_place', l: 'Signage' }
                  ];
                  const passed = items.filter(i => chk[i.k]).length;
                  const scorePct = Math.round((passed / items.length) * 100);
                  
                  return (
                    <div key={chk.id} className="card p-5">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-100  pb-3">
                        <div className="flex items-center gap-2 font-semibold text-primary ">
                          <CheckSquare className="w-5 h-5 text-success" /> {fmtDate(chk.checklist_date)}
                        </div>
                        <span className={`badge ${scorePct === 100 ? 'badge-green' : scorePct >= 60 ? 'badge-yellow' : 'badge-red'}`}>
                          {scorePct}% Safe
                        </span>
                        <button type="button" className="btn-icon btn-ghost" title="Edit checklist" onClick={() => { setEditingChecklist(chk); setShowChecklistModal(true); }}><Pencil className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 mb-4">
                        {items.map(i => (
                          <div key={i.k} className="flex items-center gap-1.5 text-xs text-slate-600 ">
                            {chk[i.k] ? <CheckSquare className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-danger" />}
                            {i.l}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between pt-3 border-t border-slate-50 ">
                        <span>Checked by: {chk.checked_by_name}</span>
                        <button onClick={() => handleDeleteChecklist(chk.id)} className="btn-icon btn-ghost text-red-400 hover:text-red-600" title="Delete checklist"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {showIncidentModal && <IncidentModal initial={editingIncident}
        onClose={() => { setShowIncidentModal(false); setEditingIncident(null); }}
        onSave={() => { setShowIncidentModal(false); setEditingIncident(null); loadData(); }} projectId={projectId} />}
      {showChecklistModal && <ChecklistModal initial={editingChecklist}
        onClose={() => { setShowChecklistModal(false); setEditingChecklist(null); }}
        onSave={() => { setShowChecklistModal(false); setEditingChecklist(null); loadData(); }} projectId={projectId} />}
    </div>
  );
}
