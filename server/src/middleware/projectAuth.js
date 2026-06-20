const pool = require('../db/pool');

const projectAuth = (resourceType = 'project', idParamName = 'id') => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      // Admins always allowed
      if (user.role === 'admin') return next();

      // If it's a worker, they should generally use dedicated self-service endpoints.
      // Deny them here unless we explicitly bypass this middleware for worker self-service.
      if (user.role === 'worker') {
        return res.status(403).json({ message: 'Forbidden: Workers must use self-service endpoints' });
      }

      let resourceId = req.params[idParamName] || req.body.project_id || req.query.project_id;
      
      // If no ID is provided, allow the request to pass through so the route handler can apply list filters
      if (!resourceId) return next();

      let projectId = null;

      if (resourceType === 'project') {
        // For project routes, the resource ID is the project ID
        projectId = req.params[idParamName] || req.body.project_id || req.query.project_id;
      } else {
        // Identify table name based on resource type
        let tableName = resourceType;
        if (resourceType === 'worker') tableName = 'workers';
        else if (resourceType === 'expense') tableName = 'expenses';
        else if (resourceType === 'log') tableName = 'daily_logs';
        else if (resourceType === 'issue') tableName = 'issues';
        else if (resourceType === 'photo') tableName = 'photos';
        else if (resourceType === 'document') tableName = 'documents';
        else if (resourceType === 'task') tableName = 'tasks';
        else if (resourceType === 'material') tableName = 'materials';
        else if (resourceType === 'equipment') tableName = 'equipment';
        else if (resourceType === 'milestone') tableName = 'milestones';
        else if (resourceType === 'safety_incident') tableName = 'safety_incidents';
        else if (resourceType === 'purchase_order') tableName = 'purchase_orders';
        else if (resourceType === 'attendance') tableName = 'attendance';
        else if (resourceType === 'bom') tableName = 'bill_of_materials';
        else if (resourceType === 'safety_checklist') tableName = 'safety_checklists';
        
        // If there is no specific resource ID in the URL, but project_id is provided (e.g. GET list or POST new)
        if (!req.params[idParamName] && (req.body.project_id || req.query.project_id)) {
           projectId = req.body.project_id || req.query.project_id;
        } else if (req.params[idParamName]) {
           // If modifying a specific child resource, lookup its project_id
           const { rows } = await pool.query(`SELECT project_id FROM ${tableName} WHERE id = $1`, [req.params[idParamName]]);
           if (!rows.length) return res.status(404).json({ message: `${resourceType} not found` });
           projectId = rows[0].project_id;
        }
      }

      if (!projectId) return next();

      const { rows } = await pool.query('SELECT manager_id FROM projects WHERE id = $1', [projectId]);
      if (!rows.length) return res.status(404).json({ message: 'Project not found' });

      if (user.role === 'manager') {
        if (rows[0].manager_id !== user.id) {
          return res.status(403).json({ message: 'Forbidden: You do not have access to this project' });
        }
        return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
};

module.exports = projectAuth;
