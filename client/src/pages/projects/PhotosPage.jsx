import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { photosAPI } from '../../api';
import { Upload, X, Camera, Calendar, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Loader2, AlertTriangle } from 'lucide-react';

function EditPhotoModal({ photo, onClose, onSave }) {
  const [caption, setCaption] = useState(photo.caption || '');
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await photosAPI.update(photo.id, { caption }); toast.success('Caption updated!'); onSave(); }
    catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Edit Photo Caption</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="label">Caption</label>
              <input className="input" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Describe this photo..." />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PhotosPage() {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo]   = useState('');
  const fileRef = useRef();

  const loadPhotos = () => photosAPI.getByProject(id)
    .then(r => setPhotos(r.data || []))
    .catch(err => setError(err.response?.data?.message || 'Failed to load photos'))
    .finally(() => setLoading(false));

  useEffect(() => { loadPhotos(); }, [id]);

  const handleDelete = async (photoId) => {
    if (!confirm('Delete this photo?')) return;
    try { await photosAPI.delete(photoId); toast.success('Photo deleted'); loadPhotos(); }
    catch { toast.error('Failed to delete photo'); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project_id', id);
      formData.append('date', new Date().toISOString().split('T')[0]);
      await photosAPI.upload(formData);
      toast.success('Photo uploaded!');
      loadPhotos();
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const filtered = photos.filter(p => {
    const d = new Date(p.photo_date);
    if (from && d < new Date(from)) return false;
    if (to   && d > new Date(to))   return false;
    return true;
  });

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Photo Gallery</h1>
          <p className="page-subtitle">{photos.length} site photos</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button className="btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
              {uploading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <><Upload className="w-4 h-4" /> Upload Photo</>}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Max size: 5MB • Rec: 1920x1080px</p>
        </div>
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-3 mb-5">
        <div className="form-group"><label className="label">From</label><input type="date" className="input" value={from} onChange={e => setFrom(e.target.value)} /></div>
        <div className="form-group"><label className="label">To</label><input type="date" className="input" value={to} onChange={e => setTo(e.target.value)} /></div>
        {(from || to) && <button className="btn-ghost mt-5" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="group relative rounded-card overflow-hidden shadow-card">
            <img src={p.url} alt={p.caption} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => setSelected(p)} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 pointer-events-none">
              <div className="flex justify-end gap-1.5 pointer-events-auto">
                <button className="bg-white/90 rounded-full p-1.5 shadow hover:bg-white" title="Edit caption" onClick={(e) => { e.stopPropagation(); setEditingPhoto(p); }}>
                  <Pencil className="w-3 h-3 text-slate-700" />
                </button>
                <button className="bg-white/90 rounded-full p-1.5 shadow hover:bg-white" title="Delete photo" onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
              <div>
                <p className="text-white text-xs font-medium">{p.caption}</p>
                <p className="text-white/70 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.photo_date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Camera className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500">No photos yet. Upload the first one!</p>
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute -top-4 -right-4 bg-white rounded-full p-1.5 shadow-modal z-10">
              <X className="w-5 h-5 text-slate-600" />
            </button>
            <img src={selected.url} alt={selected.caption} className="w-full max-h-[80vh] object-contain rounded-t-xl bg-black/5 shadow-modal" />
            <div className="bg-white rounded-b-xl px-5 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">{selected.caption}</p>
                <p className="text-xs text-slate-400">{selected.photo_date} · Uploaded by {selected.uploaded_by_name}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-icon btn-ghost" title="Edit caption" onClick={() => { setSelected(null); setEditingPhoto(selected); }}><Pencil className="w-4 h-4" /></button>
                <button className="btn-icon btn-ghost text-red-400 hover:text-red-600" title="Delete" onClick={() => { setSelected(null); handleDelete(selected.id); }}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingPhoto && (
        <EditPhotoModal photo={editingPhoto} onClose={() => setEditingPhoto(null)}
          onSave={() => { setEditingPhoto(null); loadPhotos(); }} />
      )}
    </div>
  );
}
