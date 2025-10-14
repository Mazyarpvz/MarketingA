import { Router } from 'express';
import { getDb } from '../db';
import { StatusCountResponseSchema } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date as string || new Date().toISOString().split('T')[0];
    
    const db = getDb();
    
    const statusCounts = db.prepare(`
      WITH last_status AS (
        SELECT h.task_id, h.status_id, h.progress_percent, h.changed_at
        FROM task_status_history h
        WHERE h.changed_at = (
          SELECT MAX(h2.changed_at) 
          FROM task_status_history h2 
          WHERE h2.task_id = h.task_id
        )
      )
      SELECT s.code AS status, COUNT(*) AS count
      FROM last_status ls
      JOIN status s ON s.status_id = ls.status_id
      GROUP BY s.code
      ORDER BY count DESC
    `).all() as Array<{ status: string; count: number }>;
    
    const validatedResponse = statusCounts.map(item => 
      StatusCountResponseSchema.parse(item)
    );
    
    res.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching status counts:', error);
    res.status(500).json({ error: 'خطا در دریافت تعداد وضعیت‌ها' });
  }
});

export default router;
