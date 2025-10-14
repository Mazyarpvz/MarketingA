import { Router } from 'express';
import { getDb } from '../db';
import { OwnerCountResponseSchema } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date as string || new Date().toISOString().split('T')[0];
    
    const db = getDb();
    
    const ownerCounts = db.prepare(`
      WITH last_owner AS (
        SELECT a.task_id, a.owner_id
        FROM task_assignment a
        WHERE a.valid_to IS NULL
        UNION
        SELECT a2.task_id, a2.owner_id
        FROM task_assignment a2
        WHERE a2.valid_from = (
          SELECT MAX(x.valid_from) 
          FROM task_assignment x 
          WHERE x.task_id = a2.task_id
        )
      )
      SELECT IFNULL(o.display_name, '—') AS owner, COUNT(*) AS count
      FROM task t
      LEFT JOIN last_owner lo ON lo.task_id = t.task_id
      LEFT JOIN owner o ON o.owner_id = lo.owner_id
      GROUP BY owner
      ORDER BY count DESC
    `).all() as Array<{ owner: string; count: number }>;
    
    const validatedResponse = ownerCounts.map(item => 
      OwnerCountResponseSchema.parse(item)
    );
    
    res.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching owner counts:', error);
    res.status(500).json({ error: 'خطا در دریافت تعداد مالکان' });
  }
});

export default router;
