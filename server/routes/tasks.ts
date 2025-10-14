import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db';
import { TasksQuerySchema, TaskListResponseSchema } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validationResult = TasksQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'پارامترهای نامعتبر',
        details: validationResult.error.issues 
      });
    }
    
    const query = validationResult.data;
    const {
      page = '1',
      pageSize = '20',
      q,
      ownerId,
      statusCode,
      projectId,
      moduleId,
      dateFrom,
      dateTo,
    } = query;
    
    const db = getDb();
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    
    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (q) {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    
    if (ownerId) {
      conditions.push('lo.owner_id = ?');
      params.push(parseInt(ownerId));
    }
    
    if (statusCode) {
      conditions.push('s.code = ?');
      params.push(statusCode);
    }
    
    if (projectId) {
      conditions.push('t.project_id = ?');
      params.push(parseInt(projectId));
    }
    
    if (moduleId) {
      conditions.push('t.module_id = ?');
      params.push(parseInt(moduleId));
    }
    
    if (dateFrom) {
      conditions.push('date(td.due_at) >= date(?)');
      params.push(dateFrom);
    }
    
    if (dateTo) {
      conditions.push('date(td.due_at) <= date(?)');
      params.push(dateTo);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM task t
      JOIN task_dates td ON td.task_id = t.task_id
      JOIN (
        SELECT h1.task_id, h1.status_id, h1.progress_percent
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
      LEFT JOIN project p ON p.project_id = t.project_id
      LEFT JOIN module m ON m.module_id = t.module_id
      ${whereClause}
    `;
    
    const totalResult = db.prepare(countQuery).get(...params) as { total: number };
    
    // Get tasks with pagination
    const tasksQuery = `
      SELECT 
        t.task_id,
        t.title,
        IFNULL(o.display_name, '—') AS owner,
        s.code AS status,
        p.name AS project,
        m.name AS module,
        td.start_at,
        td.due_at,
        ls.progress_percent
      FROM task t
      JOIN task_dates td ON td.task_id = t.task_id
      JOIN (
        SELECT h1.task_id, h1.status_id, h1.progress_percent
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
      LEFT JOIN project p ON p.project_id = t.project_id
      LEFT JOIN module m ON m.module_id = t.module_id
      ${whereClause}
      ORDER BY td.due_at ASC, s.code
      LIMIT ? OFFSET ?
    `;
    
    const tasks = db.prepare(tasksQuery).all(...params, parseInt(pageSize), offset) as Array<{
      task_id: number;
      title: string;
      owner: string;
      status: string;
      project: string;
      module: string;
      start_at: string | null;
      due_at: string | null;
      progress_percent: number;
    }>;
    
    const response = {
      rows: tasks,
      total: totalResult.total,
    };
    
    const validatedResponse = TaskListResponseSchema.parse(response);
    res.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching tasks:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      query: req.query,
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
      error: 'خطا در دریافت لیست تسک‌ها',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : String(error))
        : undefined
    });
  }
});

export default router;
