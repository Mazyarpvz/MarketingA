import { Router } from 'express';
import { getDb } from '../db';
import { OverdueTaskSchema } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date as string || new Date().toISOString().split('T')[0];
    
    const db = getDb();
    
    const overdueTasks = db.prepare(`
      SELECT 
        t.task_id, 
        t.title, 
        IFNULL(o.display_name, '—') AS owner, 
        td.due_at, 
        s.code AS status,
        CAST((julianday(?) - julianday(td.due_at)) AS INT) AS days_overdue
      FROM task t
      JOIN task_dates td ON td.task_id = t.task_id
      JOIN (
        SELECT h1.task_id, h1.status_id
        FROM task_status_history h1
        WHERE h1.changed_at = (
          SELECT MAX(h2.changed_at) 
          FROM task_status_history h2 
          WHERE h2.task_id = h1.task_id
        )
      ) ls ON ls.task_id = t.task_id
      LEFT JOIN (
        SELECT a1.task_id, a1.owner_id
        FROM task_assignment a1
        WHERE a1.valid_to IS NULL
        UNION
        SELECT a2.task_id, a2.owner_id
        FROM task_assignment a2
        WHERE a2.valid_from = (
          SELECT MAX(x.valid_from) 
          FROM task_assignment x 
          WHERE x.task_id = a2.task_id
        )
      ) lo ON lo.task_id = t.task_id
      LEFT JOIN owner o ON o.owner_id = lo.owner_id
      LEFT JOIN status s ON s.status_id = ls.status_id
      WHERE td.due_at IS NOT NULL
        AND date(td.due_at) < date(?)
        AND s.code <> 'Done'
      ORDER BY days_overdue DESC
    `).all(targetDate, targetDate) as Array<{
      task_id: number;
      title: string;
      owner: string;
      due_at: string;
      status: string;
      days_overdue: number;
    }>;
    
    const validatedResponse = overdueTasks.map(task => 
      OverdueTaskSchema.parse(task)
    );
    
    res.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    res.status(500).json({ error: 'خطا در دریافت تسک‌های معوق' });
  }
});

export default router;
