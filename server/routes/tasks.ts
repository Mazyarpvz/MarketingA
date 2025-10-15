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

// POST - Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, projectId, moduleId, ownerId, statusCode, startAt, dueAt, progressPercent } = req.body;

    console.log('Creating task with data:', req.body);

    // Validation
    if (!title || !projectId) {
      return res.status(400).json({ error: 'عنوان و پروژه الزامی هستند' });
    }

    const db = getDb();
    const now = new Date().toISOString();

    // Validate project exists
    const proj = db.prepare('SELECT project_id FROM project WHERE project_id = ?').get(projectId) as { project_id: number } | undefined;
    if (!proj) {
      return res.status(400).json({ error: 'پروژه یافت نشد', details: { projectId } });
    }

    // Ensure we have a valid module_id for this project (FK is NOT NULL)
    let moduleIdToUse: number | null = moduleId ?? null;
    if (moduleIdToUse) {
      // Ensure provided module belongs to the same project
      const mod = db.prepare('SELECT module_id FROM module WHERE module_id = ? AND project_id = ?').get(moduleIdToUse, projectId) as { module_id: number } | undefined;
      if (!mod) {
        // ignore wrong module and pick/create a valid one for the project
        moduleIdToUse = null;
      }
    }
    if (!moduleIdToUse) {
      const row = db.prepare('SELECT module_id FROM module WHERE project_id = ? ORDER BY module_id ASC LIMIT 1').get(projectId) as { module_id: number } | undefined;
      if (row?.module_id) {
        moduleIdToUse = row.module_id;
      } else {
        // Create a default module if none exists for this project
        const defaultName = 'بدون دسته';
        const insertModule = db.prepare('INSERT INTO module (project_id, name) VALUES (?, ?)');
        const modRes = insertModule.run(projectId, defaultName);
        moduleIdToUse = modRes.lastInsertRowid as number;
      }
    }

    // Note: task_id is AUTO INCREMENT, so we don't provide it
    // We also need source_system and external_task_id based on schema
    const externalTaskId = `TASK-${Date.now()}`;

    // Insert into task
    const insertTask = db.prepare(`
      INSERT INTO task (source_system, external_task_id, title, description, project_id, module_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertTask.run('WEB_UI', externalTaskId, title, description || null, projectId, moduleIdToUse, now);
    const taskId = result.lastInsertRowid as number;

    console.log('✓ Task inserted with ID:', taskId, 'module_id:', moduleIdToUse);

    // Insert task_dates
    const insertDates = db.prepare(`
      INSERT INTO task_dates (task_id, start_at, due_at)
      VALUES (?, ?, ?)
    `);
    insertDates.run(taskId, startAt || null, dueAt || null);
    console.log('✓ Task dates inserted');

    // Get status ID (default Open)
    const statusQuery = db.prepare('SELECT status_id FROM status WHERE code = ?');
    const statusResult = statusQuery.get(statusCode || 'Open') as { status_id: number } | undefined;
    if (!statusResult) {
      throw new Error(`Status '${statusCode || 'Open'}' not found`);
    }

    // Insert task_status_history with initial progress
    const insertStatus = db.prepare(`
      INSERT INTO task_status_history (task_id, status_id, changed_at, progress_percent)
      VALUES (?, ?, ?, ?)
    `);
    insertStatus.run(taskId, statusResult.status_id, now, progressPercent ?? 0);
    console.log('✓ Task status inserted');

    // Insert task_assignment if owner provided (task_assignment has no assigned_at column)
    if (ownerId) {
      const owner = db.prepare('SELECT owner_id FROM owner WHERE owner_id = ?').get(ownerId) as { owner_id: number } | undefined;
      if (!owner) {
        return res.status(400).json({ error: 'مالک یافت نشد', details: { ownerId } });
      }
      const insertAssignment = db.prepare(`
        INSERT INTO task_assignment (task_id, owner_id, valid_from)
        VALUES (?, ?, ?)
      `);
      insertAssignment.run(taskId, ownerId, now);
      console.log('✓ Task assignment inserted');
    }

    res.status(201).json({
      success: true,
      taskId: taskId.toString(),
      externalTaskId,
      message: 'تسک با موفقیت ایجاد شد'
    });

    console.log(`✅ Task created successfully: ${taskId} (${externalTaskId}) - ${title}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('❌ Error creating task:', {
      error: errorMessage,
      stack: errorStack,
      body: req.body,
    });

    res.status(500).json({
      error: 'خطا در ایجاد تسک',
      message: errorMessage,
      details: errorStack
    });
  }
});


// PUT - Update task
router.put('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, projectId, moduleId, ownerId, statusCode, startAt, dueAt, progressPercent } = req.body;
    
    const db = getDb();
    const now = new Date().toISOString();
    
    // Check if task exists
    const taskExists = db.prepare('SELECT task_id FROM task WHERE task_id = ?').get(taskId);
    if (!taskExists) {
      return res.status(404).json({ error: 'تسک یافت نشد' });
    }
    
    // Update task (remove non-existent updated_at column)
    if (title || projectId || moduleId) {
      // If projectId provided but moduleId not provided, ensure module FK remains valid
      let moduleIdToUse = moduleId as number | undefined;
      if (!moduleIdToUse && projectId) {
        const row = db.prepare('SELECT module_id FROM module WHERE project_id = ? ORDER BY module_id ASC LIMIT 1').get(projectId) as { module_id: number } | undefined;
        moduleIdToUse = row?.module_id;
      }

      const updateTask = db.prepare(`
        UPDATE task 
        SET title = COALESCE(?, title),
            project_id = COALESCE(?, project_id),
            module_id = COALESCE(?, module_id)
        WHERE task_id = ?
      `);
      updateTask.run(title, projectId, moduleIdToUse, taskId);
    }
    
    // Update dates
    if (startAt !== undefined || dueAt !== undefined) {
      const updateDates = db.prepare(`
        UPDATE task_dates 
        SET start_at = COALESCE(?, start_at),
            due_at = COALESCE(?, due_at)
        WHERE task_id = ?
      `);
      updateDates.run(startAt, dueAt, taskId);
    }
    
    // Update status
    if (statusCode) {
      const statusId = db.prepare('SELECT status_id FROM status WHERE code = ?').get(statusCode) as { status_id: number } | undefined;
      if (statusId) {
        const insertStatus = db.prepare(`
          INSERT INTO task_status_history (task_id, status_id, changed_at)
          VALUES (?, ?, ?)
        `);
        insertStatus.run(taskId, statusId.status_id, now);
      } else {
        throw new Error(`Status '${statusCode}' not found`);
      }
    }
    
    // Update owner
    if (ownerId) {
      // Delete old assignment
      db.prepare('DELETE FROM task_assignment WHERE task_id = ?').run(taskId);
      // Insert new assignment
      const insertAssignment = db.prepare(`
        INSERT INTO task_assignment (task_id, owner_id, valid_from)
        VALUES (?, ?, ?)
      `);
      insertAssignment.run(taskId, ownerId, now);
    }
    
    // Update progress (record in status history with current/latest status)
    if (progressPercent !== undefined) {
      // Get the most recent status for this task
      const latestStatus = db.prepare(`
        SELECT status_id FROM task_status_history
        WHERE task_id = ?
        ORDER BY changed_at DESC
        LIMIT 1
      `).get(taskId) as { status_id: number } | undefined;

      // Use the current status from the request if provided, otherwise use latest or default
      let statusIdToUse = latestStatus?.status_id;
      if (!statusIdToUse) {
        const defaultStatus = db.prepare('SELECT status_id FROM status WHERE code = ?').get('Open') as { status_id: number } | undefined;
        statusIdToUse = defaultStatus?.status_id;
      }
      
      if (statusIdToUse) {
        const insertProgressAsStatus = db.prepare(`
          INSERT INTO task_status_history (task_id, status_id, progress_percent, changed_at)
          VALUES (?, ?, ?, ?)
        `);
        insertProgressAsStatus.run(taskId, statusIdToUse, progressPercent, now);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'تسک با موفقیت بروزرسانی شد' 
    });
    
    console.log(`✅ Task updated: ${taskId}`);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      error: 'خطا در بروزرسانی تسک',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : String(error))
        : undefined
    });
  }
});

// DELETE - Delete task
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const db = getDb();
    
    // Check if task exists
    const taskExists = db.prepare('SELECT task_id FROM task WHERE task_id = ?').get(taskId);
    if (!taskExists) {
      return res.status(404).json({ error: 'تسک یافت نشد' });
    }
    
  // Delete related records (in correct order due to foreign keys)
    db.prepare('DELETE FROM fact_task_daily WHERE task_id = ?').run(taskId);
    db.prepare('DELETE FROM task_assignment WHERE task_id = ?').run(taskId);
    db.prepare('DELETE FROM task_status_history WHERE task_id = ?').run(taskId);
    db.prepare('DELETE FROM task_dates WHERE task_id = ?').run(taskId);
    db.prepare('DELETE FROM task WHERE task_id = ?').run(taskId);
    
    res.json({ 
      success: true, 
      message: 'تسک با موفقیت حذف شد' 
    });
    
    console.log(`🗑️ Task deleted: ${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      error: 'خطا در حذف تسک',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : String(error))
        : undefined
    });
  }
});

export default router;
