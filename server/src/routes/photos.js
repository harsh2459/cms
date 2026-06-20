const express  = require('express');
const pool     = require('../db/pool');
const auth     = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const router   = express.Router();

// GET /api/photos?project_id=&from=&to=
router.get('/', auth, projectAuth('photo'), async (req, res) => {
  try {
    const { project_id, from, to } = req.query;
    if (!project_id) return res.status(400).json({ message: 'project_id required' });
    let q = `SELECT ph.*, u.name AS uploaded_by_name FROM photos ph
      JOIN users u ON ph.uploaded_by=u.id WHERE ph.project_id=$1`;
    const params = [project_id];
    let i = 2;
    if (from) { q += ` AND ph.photo_date >= $${i++}`; params.push(from); }
    if (to)   { q += ` AND ph.photo_date <= $${i++}`; params.push(to); }
    q += ' ORDER BY ph.photo_date DESC';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/photos — multipart/form-data upload
router.post('/', auth, projectAuth('photo'), upload.single('file'), async (req, res) => {
  try {
    const { caption, project_id, date } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let url;
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'cms/photos', 'image');
      url = result.secure_url;
    } catch {
      // Fallback for dev without Cloudinary
      url = `https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800`;
    }

    const { rows } = await pool.query(
      `INSERT INTO photos (url, caption, photo_date, project_id, uploaded_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [url, caption, date || new Date().toISOString().split('T')[0], project_id, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/photos/:id — update caption
router.put('/:id', auth, projectAuth('photo'), async (req, res) => {
  try {
    const { caption } = req.body;
    const { rows } = await pool.query(
      'UPDATE photos SET caption=$1 WHERE id=$2 RETURNING *',
      [caption, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Photo not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/photos/:id
router.delete('/:id', auth, restrict('admin','manager'), projectAuth('photo'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM photos WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Photo not found' });
    res.json({ message: 'Photo deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
