import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db';
import { KpiResponseSchema } from '../types';

const router = Router();

// Input validation schema
const KpiQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validationResult = KpiQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'پارامترهای نامعتبر',
        details: validationResult.error.issues 
      });
    }
    
    const { date } = validationResult.data;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const db = getDb();
    
    // Get latest status for each task
    const latestStatuses = db.prepare(`
      WITH last_status AS (
        SELECT h.task_id, h.status_id, h.progress_percent, h.changed_at
        FROM task_status_history h
        WHERE h.changed_at = (
          SELECT MAX(h2.changed_at) 
          FROM task_status_history h2 
          WHERE h2.task_id = h.task_id
        )
      )
      SELECT 
        ls.task_id,
        ls.status_id,
        ls.progress_percent,
        s.code as status_code
      FROM last_status ls
      JOIN status s ON s.status_id = ls.status_id
    `).all() as Array<{
      task_id: number;
      status_id: number;
      progress_percent: number;
      status_code: string;
    }>;
    
    // Calculate KPIs
    const totalTasks = latestStatuses.length;
    const done = latestStatuses.filter(s => s.status_code === 'Done').length;
    const inProgress = latestStatuses.filter(s => s.status_code === 'In Progress').length;
    const blocked = latestStatuses.filter(s => s.status_code === 'Blocked').length;
    
    // Calculate overdue count
    const overdueCount = db.prepare(`
      SELECT COUNT(*) as count
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
      JOIN status s ON s.status_id = ls.status_id
      WHERE td.due_at IS NOT NULL
        AND date(td.due_at) < date(?)
        AND s.code <> 'Done'
    `).get(targetDate) as { count: number };
    
    // Calculate due this week count
    const dueThisWeekCount = db.prepare(`
      SELECT COUNT(*) as count
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
      JOIN status s ON s.status_id = ls.status_id
      WHERE td.due_at IS NOT NULL
        AND date(td.due_at) BETWEEN date(?) AND date(?, '+7 days')
        AND s.code <> 'Done'
    `).get(targetDate, targetDate) as { count: number };
    
    // Calculate average progress
    const avgProgress = latestStatuses.length > 0 
      ? latestStatuses.reduce((sum, s) => sum + s.progress_percent, 0) / latestStatuses.length
      : 0;
    
    const response = {
      total_tasks: totalTasks,
      done,
      in_progress: inProgress,
      blocked,
      overdue_count: overdueCount.count,
      due_this_week_count: dueThisWeekCount.count,
      avg_progress: Math.round(avgProgress),
    };
    
    const validatedResponse = KpiResponseSchema.parse(response);
    res.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching KPI data:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    // Send appropriate error response
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'خطا در اعتبارسنجی داده‌ها',
        details: error.issues 
      });
    }
    
    res.status(500).json({ 
      error: 'خطا در دریافت اطلاعات KPI',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : String(error))
        : undefined
    });
  }
});

export default router;
