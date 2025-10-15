import { getDb } from '../db';

function ensureProject(projectId: number): void {
  const db = getDb();
  const row = db.prepare('SELECT project_id FROM project WHERE project_id = ?').get(projectId) as any;
  if (!row) {
    db.prepare('INSERT INTO project (name) VALUES (?)').run('پروژه پیش‌فرض');
  }
}

function ensureModule(projectId: number): number {
  const db = getDb();
  const row = db
    .prepare('SELECT module_id FROM module WHERE project_id = ? ORDER BY module_id ASC LIMIT 1')
    .get(projectId) as { module_id: number } | undefined;
  if (row?.module_id) return row.module_id;
  const res = db.prepare('INSERT INTO module (project_id, name) VALUES (?, ?)').run(projectId, 'بدون دسته');
  return res.lastInsertRowid as number;
}

function main() {
  const db = getDb();
  const projectId = 1;
  ensureProject(projectId);
  const moduleId = ensureModule(projectId);
  const now = new Date().toISOString();
  const externalTaskId = `SCRIPT-${Date.now()}`;

  const res = db
    .prepare(
      'INSERT INTO task (source_system, external_task_id, title, description, project_id, module_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run('WEB_UI', externalTaskId, 'تسک از اسکریپت', null, projectId, moduleId, now);

  const taskId = res.lastInsertRowid as number;

  db.prepare('INSERT INTO task_dates (task_id, start_at, due_at) VALUES (?, ?, ?)')
    .run(taskId, now, null);

  const statusId = (db.prepare('SELECT status_id FROM status WHERE code = ?').get('Open') as any)?.status_id;
  db.prepare('INSERT INTO task_status_history (task_id, status_id, progress_percent, changed_at) VALUES (?, ?, ?, ?)')
    .run(taskId, statusId, 0, now);

  console.log(JSON.stringify({ ok: true, taskId, externalTaskId }, null, 2));
}

main();
