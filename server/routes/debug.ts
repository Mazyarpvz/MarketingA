import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

// Simple echo to verify JSON parsing/middleware and CORS
router.post('/echo', (req, res) => {
  res.json({ ok: true, body: req.body });
});

// Minimal insert to test DB constraints in isolation
router.post('/create-minimal', (req, res) => {
  try {
    const { title, projectId } = req.body || {};
    if (!title || !projectId) {
      return res.status(400).json({ error: 'title و projectId الزامی هستند' });
    }

    const db = getDb();

    // ensure valid module_id for the given project
    let moduleIdToUse: number | null = null;
    const row = db
      .prepare('SELECT module_id FROM module WHERE project_id = ? ORDER BY module_id ASC LIMIT 1')
      .get(projectId) as { module_id: number } | undefined;
    if (row?.module_id) {
      moduleIdToUse = row.module_id;
    } else {
      const modRes = db.prepare('INSERT INTO module (project_id, name) VALUES (?, ?)').run(projectId, 'بدون دسته');
      moduleIdToUse = modRes.lastInsertRowid as number;
    }

    const now = new Date().toISOString();
    const externalTaskId = `DBG-${Date.now()}`;

    const result = db
      .prepare(
        'INSERT INTO task (source_system, external_task_id, title, description, project_id, module_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .run('WEB_UI', externalTaskId, title, null, projectId, moduleIdToUse, now);

    const taskId = result.lastInsertRowid as number;
    return res.status(201).json({ ok: true, taskId, externalTaskId });
  } catch (err: any) {
    return res.status(500).json({ error: 'debug insert failed', message: err?.message, stack: err?.stack });
  }
});

export default router;
