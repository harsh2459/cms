import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { documentsAPI } from '../../api';
import { Upload, X, FileText, Download, Eye, AlertTriangle, Tag, Trash2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, differenceInDays, parseISO } from 'date-fns';

const CATEGORIES = ['Contract','Drawing','Permit','Invoice','Report','Other'];
const CAT_COLORS  = { Contract:'badge-blue', Drawing:'badge-purple', Permit:'badge-green', Invoice:'badge-yellow', Report:'badge-navy', Other:'badge-gray' };
const ACCESS_LEVELS = ['all', 'admin'];

function EditDocModal({ doc, onClose, onSave }) {
  const [form, setForm] = useState({ name: doc.name || '', category: doc.category || 'Drawing', expiry_date: doc.expiry_date?.slice(0,10) || '', access_level: doc.access_level || 'all' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await documentsAPI.update(doc.id, form); toast.success('Document updated!'); onSave(); }
    catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Edit Document</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="form-group">
              <label className="label">Document Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Category</label>
                <select className="select" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Access Level</label>
                <select className="select" value={form.access_level} onChange={e => setForm(f=>({...f,access_level:e.target.value}))}>
                  {ACCESS_LEVELS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="label">Expiry Date (optional)</label>
              <input type="date" className="input" value={form.expiry_date} onChange={e => setForm(f=>({...f,expiry_date:e.target.value}))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadModal({ projectId, onClose, onSave }) {
  const [form, setForm] = useState({ name:'', category:'Drawing', expiry_date:'', access_level:'all' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      fd.append('project_id', projectId);
      if (file) fd.append('file', file);
      await documentsAPI.upload(fd);
      toast.success('Document uploaded!'); onSave();
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Upload Document</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="form-group">
              <label className="label">Document Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Category</label>
                <select className="select" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Access Level</label>
                <select className="select" value={form.access_level} onChange={e => setForm(f=>({...f,access_level:e.target.value}))}>
                  {ACCESS_LEVELS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="label">Expiry Date (optional)</label>
              <input type="date" className="input" value={form.expiry_date} onChange={e => setForm(f=>({...f,expiry_date:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="label">File *</label>
              <input type="file" className="input" onChange={e => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png,.gif,.docx,.xlsx" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <><Upload className="w-4 h-4" /> Upload</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { id } = useParams();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const load = () => {
    setLoading(true);
    documentsAPI.getByProject(id)
      .then(r => setDocs(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [id]);

  const filtered = docs.filter(d => catFilter === 'All' || d.category === catFilter);

  const getExpiryStatus = (expiry) => {
    if (!expiry) return null;
    const days = differenceInDays(parseISO(expiry), new Date());
    if (days < 0) return { label: 'Expired', color: 'text-danger' };
    if (days <= 30) return { label: `Expires in ${days}d`, color: 'text-warning' };
    return { label: format(parseISO(expiry), 'dd MMM yyyy'), color: 'text-slate-400' };
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
        <p className="page-subtitle">{loading ? 'Loading…' : `${docs.length} documents`}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${catFilter === c ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead><tr>
            <th>Document</th><th>Category</th><th>Version</th><th>Access</th><th>Expiry</th><th>Uploaded</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(doc => {
              const expiry = getExpiryStatus(doc.expiry_date);
              return (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-primary text-sm">{doc.name}</span>
                      {doc.access_level === 'admin' && <span className="badge badge-navy">Admin Only</span>}
                    </div>
                  </td>
                  <td><span className={`${CAT_COLORS[doc.category]} badge`}>{doc.category}</span></td>
                  <td><span className="badge badge-gray">v{doc.version}</span></td>
                  <td><Tag className="w-3 h-3 text-slate-400 inline" /> {doc.access_level}</td>
                  <td>
                    {expiry ? (
                      <span className={`text-xs font-medium ${expiry.color}`}>
                        {expiry.label}
                        {expiry.color === 'text-warning' && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                      </span>
                    ) : <span className="text-xs text-slate-400">—</span>}
                  </td>
                  <td className="text-xs text-slate-400">{doc.uploaded_by_name} &middot; {doc.created_at ? format(new Date(doc.created_at), 'dd MMM yyyy, HH:mm') : 'Unknown'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingDoc(doc)} className="btn-icon btn-ghost" title="Edit document"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => {
                        try {
                          toast.loading('Preparing download…', { id: 'dl' });
                          // Get signed Cloudinary URL from server (auth-protected)
                          const { data } = await documentsAPI.getUrl(doc.id);
                          // Fetch the file as blob — avoids proxy/redirect chain issues
                          const resp = await fetch(data.file_url);
                          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                          const blob = await resp.blob();
                          const objUrl = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = objUrl;
                          a.download = `${doc.name}.${data.file_type || 'pdf'}`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(objUrl);
                          toast.success('Downloaded!', { id: 'dl' });
                        } catch (e) { toast.error(`Download failed: ${e.message}`, { id: 'dl' }); }
                      }} className="btn-icon btn-ghost"><Download className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => {
                        if (!confirm(`Delete "${doc.name}"?`)) return;
                        try { await documentsAPI.delete(doc.id); toast.success('Deleted'); load(); }
                        catch { toast.error('Delete failed'); }
                      }} className="btn-icon btn-ghost text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && <UploadModal projectId={id} onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); load(); }} />}
      {editingDoc && <EditDocModal doc={editingDoc} onClose={() => setEditingDoc(null)} onSave={() => { setEditingDoc(null); load(); }} />}
    </div>
  );
}
