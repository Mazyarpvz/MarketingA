import { Router } from 'express';
import { getDb } from '../db';
import { MetaResponseSchema } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    
    // Get owners
    const owners = db.prepare(`
      SELECT owner_id as id, display_name as label
      FROM owner
      ORDER BY display_name
    `).all() as { id: number; label: string }[];
    
    // Get statuses
    const statuses = db.prepare(`
      SELECT status_id as id, code as label
      FROM status
      ORDER BY code
    `).all() as { id: number; label: string }[];
    
    // Get projects
    const projects = db.prepare(`
      SELECT project_id as id, name as label
      FROM project
      ORDER BY name
    `).all() as { id: number; label: string }[];
    
    // Get modules
    const modules = db.prepare(`
      SELECT module_id as id, name as label
      FROM module
      ORDER BY name
    `).all() as { id: number; label: string }[];
    
    const response = {
      owners,
      statuses,
      projects,
      modules,
    };
    
    const validatedResponse = MetaResponseSchema.parse(response);
    res.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching meta data:', error);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات متا' });
  }
});

export default router;
