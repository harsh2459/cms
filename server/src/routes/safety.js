const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const restrict = require('../middleware/role');
const projectAuth = require('../middleware/projectAuth');
const router = express.Router();

// Get all safety incidents
router.get('/incidents', auth, projectAuth('safety_incident'), async (req, res) => {
  try {
    const { project_id } = req.query;
    let query = `
      SELECT i.*, p.name AS project_name, u.name AS reported_by_name
      FROM safety_incidents i
      JOIN projects p ON i.project_id = p.id
      JOIN users u ON i.reported_by = u.id
    `;
    const params = [];
    if (project_id) {
      query += ` WHERE i.project_id = $1`;
      params.push(project_id);
    }
    query += ` ORDER BY i.incident_date DESC, i.created_at DESC`;
    
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create safety incident
router.post('/incidents', auth, projectAuth('safety_incident'), async (req, res) => {
  try {
    const { project_id, incident_date, incident_type, description, location_on_site, severity, workers_involved, medical_attention_required, photo_url } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO safety_incidents (
        project_id, reported_by, incident_date, incident_type, description, 
        location_on_site, severity, workers_involved, medical_attention_required, photo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [project_id, req.user.id, incident_date, incident_type, description, location_on_site, severity, workers_involved, medical_attention_required, photo_url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update safety incident
router.put('/incidents/:id', auth, restrict('admin', 'manager'), projectAuth('safety_incident'), async (req, res) => {
  try {
    const { incident_date, incident_type, description, location_on_site, severity,
      workers_involved, medical_attention_required, photo_url, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE safety_incidents SET
        incident_date=COALESCE($1, incident_date), incident_type=COALESCE($2, incident_type),
        description=COALESCE($3, description), location_on_site=COALESCE($4, location_on_site),
        severity=COALESCE($5, severity), workers_involved=COALESCE($6, workers_involved),
        medical_attention_required=COALESCE($7, medical_attention_required),
        photo_url=COALESCE($8, photo_url), status=COALESCE($9, status),
        closed_at=CASE WHEN $9='Closed' THEN NOW() WHEN $9 IS NOT NULL THEN NULL ELSE closed_at END
       WHERE id=$10 RETURNING *`,
      [incident_date, incident_type, description, location_on_site, severity,
        workers_involved, medical_attention_required, photo_url, status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Incident not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get safety checklists
router.get('/checklists', auth, projectAuth('safety_checklist'), async (req, res) => {
  try {
    const { project_id } = req.query;
    let query = `
      SELECT c.*, p.name AS project_name, u.name AS checked_by_name
      FROM safety_checklists c
      JOIN projects p ON c.project_id = p.id
      JOIN users u ON c.checked_by = u.id
    `;
    const params = [];
    if (project_id) {
      query += ` WHERE c.project_id = $1`;
      params.push(project_id);
    }
    query += ` ORDER BY c.checklist_date DESC`;
    
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create safety checklist
router.post('/checklists', auth, restrict('admin', 'manager'), projectAuth('safety_checklist'), async (req, res) => {
  try {
    const { project_id, checklist_date, ppe_compliance, scaffolding_safe, electrical_safe, fire_exits_clear, first_aid_available, signage_in_place, notes } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO safety_checklists (
        project_id, checked_by, checklist_date, ppe_compliance, scaffolding_safe, 
        electrical_safe, fire_exits_clear, first_aid_available, signage_in_place, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [project_id, req.user.id, checklist_date, ppe_compliance, scaffolding_safe, electrical_safe, fire_exits_clear, first_aid_available, signage_in_place, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/checklists/:id', auth, restrict('admin', 'manager'), projectAuth('safety_checklist'), async (req, res) => {
  try {
    const { checklist_date, ppe_compliance, scaffolding_safe, electrical_safe,
      fire_exits_clear, first_aid_available, signage_in_place, notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE safety_checklists SET checklist_date=$1, ppe_compliance=$2,
       scaffolding_safe=$3, electrical_safe=$4, fire_exits_clear=$5,
       first_aid_available=$6, signage_in_place=$7, notes=$8
       WHERE id=$9 RETURNING *`,
      [checklist_date, ppe_compliance, scaffolding_safe, electrical_safe,
        fire_exits_clear, first_aid_available, signage_in_place, notes, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Checklist not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete safety incident
router.delete('/incidents/:id', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM safety_incidents WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Incident not found' });
    res.json({ message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete safety checklist
router.delete('/checklists/:id', auth, restrict('admin', 'manager'), async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM safety_checklists WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Checklist not found' });
    res.json({ message: 'Checklist deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
