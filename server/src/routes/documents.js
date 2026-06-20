const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const { upload, uploadToCloudinary, cloudinary } = require('../middleware/upload');
const { sendDocumentExpiry } = require('../utils/email');
const router   = express.Router();

/**
 * Generate a signed Cloudinary URL from the stored secure_url.
 * This bypasses the "Customer is marked as untrusted / Blocked for delivery" restriction
 * because signed URLs are authenticated with the API secret.
 *
 * Cloudinary URL pattern:
 *   https://res.cloudinary.com/{cloud}/{resource_type}/upload/{version}/{public_id}.{ext}
 */
function makeSignedUrl(fileUrl, { attachment = false, expiresInSeconds = 600 } = {}) {
  try {
    // Extract resource_type and everything after /upload/
    const match = fileUrl.match(/cloudinary\.com\/[^/]+\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return fileUrl; // not a Cloudinary URL — return as-is

    const resourceType = match[1];
    const publicIdWithExt = match[2]; // e.g. cms/documents/myfile.pdf  or  cms/photos/img

    const options = {
      resource_type: resourceType,
      type: 'upload',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    };
    if (attachment) options.flags = 'attachment';

    return cloudinary.url(publicIdWithExt, options);
  } catch (e) {
    console.error('makeSignedUrl error:', e.message);
    return fileUrl;
  }
}

// GET /api/documents/expiring  — docs expiring in next 30 days (must be before '/:id' and '/')
router.get('/expiring', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    let q = `SELECT d.*, p.name AS project_name FROM documents d
       JOIN projects p ON d.project_id=p.id
       WHERE d.expiry_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'`;
    const params = [];
    if (req.user.role === 'manager') {
       q += ` AND p.manager_id=$1`;
       params.push(req.user.id);
    }
    q += ` ORDER BY d.expiry_date`;
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/documents?project_id=&category=
router.get('/', auth, projectAuth('document'), async (req, res) => {
  try {
    const { project_id, category } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    // Filter by access level
    const isAdmin = req.user.role === 'admin';
    let q = `SELECT d.*, u.name AS uploaded_by_name FROM documents d
      JOIN users u ON d.uploaded_by=u.id WHERE d.project_id=$1`;
    const params = [project_id];
    let i = 2;
    if (!isAdmin) { q += ` AND d.access_level='all'`; }
    if (category) { q += ` AND d.category=$${i++}`; params.push(category); }
    q += ' ORDER BY d.created_at DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/documents — upload
router.post('/', auth, projectAuth('document'), upload.single('file'), async (req, res) => {
  try {
    const { name, category, expiry_date, access_level, project_id, parent_id } = req.body;
    if (!req.file) return res.status(400).json({ message: 'File required' });

    let file_url, file_type;
    try {
      const isImage = req.file.mimetype.startsWith('image/');
      const result = await uploadToCloudinary(req.file.buffer, 'cms/documents', isImage ? 'image' : 'raw', req.file.originalname);
      file_url  = result.secure_url;
      file_type = req.file.mimetype.split('/')[1] || 'file';
    } catch (cloudErr) {
      console.error('Cloudinary upload error:', cloudErr.message);
      return res.status(502).json({ message: `File upload to cloud storage failed: ${cloudErr.message}` });
    }

    // Get version if parent exists
    let version = 1;
    if (parent_id) {
      const parent = await pool.query('SELECT version FROM documents WHERE id=$1', [parent_id]);
      version = (parent.rows[0]?.version || 0) + 1;
    }

    const { rows } = await pool.query(
      `INSERT INTO documents (name, category, file_url, file_type, version, expiry_date, access_level, project_id, uploaded_by, parent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, category, file_url, file_type, version, expiry_date||null, access_level||'all', project_id, req.user.id, parent_id||null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/documents/:id/url — returns a signed Cloudinary URL (bypasses account delivery restrictions)
router.get('/:id/url', auth, projectAuth('document'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT file_url, file_type, name FROM documents WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    const doc = rows[0];
    const signedUrl = makeSignedUrl(doc.file_url);
    res.json({ file_url: signedUrl, file_type: doc.file_type, name: doc.name });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/documents/:id/download
// Auth check → generate signed URL with fl_attachment → redirect browser to it
router.get('/:id/download', auth, projectAuth('document'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM documents WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    const doc = rows[0];
    if (!doc.file_url || doc.file_url === '#placeholder')
      return res.status(404).json({ message: 'File not available' });
    // Generate signed URL with attachment flag — forces download even on blocked accounts
    const signedUrl = makeSignedUrl(doc.file_url, { attachment: true });
    res.redirect(signedUrl);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/documents/:id/view
// Auth check → generate signed URL → redirect for inline view
router.get('/:id/view', auth, projectAuth('document'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM documents WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    const doc = rows[0];
    if (!doc.file_url || doc.file_url === '#placeholder')
      return res.status(404).json({ message: 'File not available' });
    const signedUrl = makeSignedUrl(doc.file_url);
    res.redirect(signedUrl);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

function getMimeType(ext) {
  const map = { pdf:'application/pdf', png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
  return map[ext?.toLowerCase()] || 'application/octet-stream';
}

// PUT /api/documents/:id — update metadata (name, category, expiry_date, access_level)
router.put('/:id', auth, restrict('admin', 'manager'), projectAuth('document'), async (req, res) => {
  try {
    const { name, category, expiry_date, access_level } = req.body;
    const { rows } = await pool.query(
      `UPDATE documents SET name=COALESCE($1,name), category=COALESCE($2,category),
       expiry_date=$3, access_level=COALESCE($4,access_level) WHERE id=$5 RETURNING *`,
      [name, category, expiry_date || null, access_level, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Document not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/documents/:id
router.delete('/:id', auth, restrict('admin', 'manager'), projectAuth('document'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM documents WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
