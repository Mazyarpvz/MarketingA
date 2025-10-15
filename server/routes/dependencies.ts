import express from 'express';
import { getDb } from '../db';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const createDependencySchema = z.object({
  task_id: z.number().int().positive(),
  depends_on_task_id: z.number().int().positive(),
  dependency_type: z.string().min(1).default('blocks'),
  notes: z.string().optional(),
  created_by: z.string().optional().default('system')
});

const updateDependencySchema = z.object({
  dependency_type: z.string().min(1).optional(),
  notes: z.string().optional()
});

// GET /api/dependencies - دریافت همه وابستگی‌ها
router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  
  const dependencies = db.prepare(`
    SELECT * FROM task_dependencies_view 
    ORDER BY created_at DESC
  `).all();
  
  res.json({
    dependencies,
    count: dependencies.length,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/dependencies/task/:taskId - دریافت وابستگی‌های یک تسک
router.get('/task/:taskId', asyncHandler(async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  if (isNaN(taskId)) {
    throw new ValidationError('شناسه تسک نامعتبر است');
  }
  
  const db = getDb();
  
  // وابستگی‌هایی که این تسک به آن‌ها وابسته است
  const dependsOn = db.prepare(`
    SELECT * FROM task_dependencies_view 
    WHERE task_id = ?
    ORDER BY created_at DESC
  `).all(taskId);
  
  // وابستگی‌هایی که به این تسک وابسته‌اند
  const dependents = db.prepare(`
    SELECT * FROM task_dependencies_view 
    WHERE depends_on_task_id = ?
    ORDER BY created_at DESC
  `).all(taskId);
  
  res.json({
    task_id: taskId,
    depends_on: dependsOn,
    dependents: dependents,
    summary: {
      depends_on_count: dependsOn.length,
      dependents_count: dependents.length,
      total_dependencies: dependsOn.length + dependents.length
    },
    timestamp: new Date().toISOString()
  });
}));

// GET /api/dependencies/types - دریافت انواع وابستگی
router.get('/types', asyncHandler(async (req, res) => {
  const db = getDb();
  
  const types = db.prepare(`
    SELECT * FROM dependency_types 
    WHERE is_active = TRUE
    ORDER BY id
  `).all();
  
  res.json({
    types,
    count: types.length,
    timestamp: new Date().toISOString()
  });
}));

// POST /api/dependencies - ایجاد وابستگی جدید
router.post('/', asyncHandler(async (req, res) => {
  const validatedData = createDependencySchema.parse(req.body);
  const { task_id, depends_on_task_id, dependency_type, notes, created_by } = validatedData;
  
  // بررسی وجود تسک‌ها
  const db = getDb();
  
  const task1 = db.prepare('SELECT id, title FROM tasks WHERE id = ?').get(task_id);
  const task2 = db.prepare('SELECT id, title FROM tasks WHERE id = ?').get(depends_on_task_id);
  
  if (!task1) {
    throw new NotFoundError(`تسک با شناسه ${task_id} یافت نشد`);
  }
  if (!task2) {
    throw new NotFoundError(`تسک با شناسه ${depends_on_task_id} یافت نشد`);
  }
  
  // بررسی عدم وجود وابستگی تکراری
  const existing = db.prepare(`
    SELECT id FROM task_dependencies 
    WHERE task_id = ? AND depends_on_task_id = ?
  `).get(task_id, depends_on_task_id);
  
  if (existing) {
    throw new ValidationError('این وابستگی قبلاً وجود دارد');
  }
  
  // بررسی عدم ایجاد circular dependency (ساده)
  const circular = db.prepare(`
    SELECT id FROM task_dependencies 
    WHERE task_id = ? AND depends_on_task_id = ?
  `).get(depends_on_task_id, task_id);
  
  if (circular) {
    throw new ValidationError('ایجاد وابستگی دایره‌ای مجاز نیست');
  }
  
  // ایجاد وابستگی
  const result = db.prepare(`
    INSERT INTO task_dependencies (task_id, depends_on_task_id, dependency_type, notes, created_by)
    VALUES (?, ?, ?, ?, ?)
  `).run(task_id, depends_on_task_id, dependency_type, notes, created_by);
  
  // دریافت وابستگی ایجاد شده
  const newDependency = db.prepare(`
    SELECT * FROM task_dependencies_view WHERE id = ?
  `).get(result.lastInsertRowid);
  
  res.status(201).json({
    message: 'وابستگی با موفقیت ایجاد شد',
    dependency: newDependency,
    timestamp: new Date().toISOString()
  });
}));

// PUT /api/dependencies/:id - به‌روزرسانی وابستگی
router.put('/:id', asyncHandler(async (req, res) => {
  const dependencyId = parseInt(req.params.id);
  if (isNaN(dependencyId)) {
    throw new ValidationError('شناسه وابستگی نامعتبر است');
  }
  
  const validatedData = updateDependencySchema.parse(req.body);
  const db = getDb();
  
  // بررسی وجود وابستگی
  const existing = db.prepare('SELECT * FROM task_dependencies WHERE id = ?').get(dependencyId);
  if (!existing) {
    throw new NotFoundError('وابستگی یافت نشد');
  }
  
  // به‌روزرسانی
  const updateFields = [];
  const updateValues = [];
  
  if (validatedData.dependency_type !== undefined) {
    updateFields.push('dependency_type = ?');
    updateValues.push(validatedData.dependency_type);
  }
  
  if (validatedData.notes !== undefined) {
    updateFields.push('notes = ?');
    updateValues.push(validatedData.notes);
  }
  
  if (updateFields.length === 0) {
    throw new ValidationError('هیچ فیلدی برای به‌روزرسانی ارسال نشده');
  }
  
  updateValues.push(dependencyId);
  
  db.prepare(`
    UPDATE task_dependencies 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `).run(...updateValues);
  
  // دریافت وابستگی به‌روزرسانی شده
  const updatedDependency = db.prepare(`
    SELECT * FROM task_dependencies_view WHERE id = ?
  `).get(dependencyId);
  
  res.json({
    message: 'وابستگی با موفقیت به‌روزرسانی شد',
    dependency: updatedDependency,
    timestamp: new Date().toISOString()
  });
}));

// DELETE /api/dependencies/:id - حذف وابستگی
router.delete('/:id', asyncHandler(async (req, res) => {
  const dependencyId = parseInt(req.params.id);
  if (isNaN(dependencyId)) {
    throw new ValidationError('شناسه وابستگی نامعتبر است');
  }
  
  const db = getDb();
  
  // بررسی وجود وابستگی
  const existing = db.prepare(`
    SELECT * FROM task_dependencies_view WHERE id = ?
  `).get(dependencyId);
  
  if (!existing) {
    throw new NotFoundError('وابستگی یافت نشد');
  }
  
  // حذف وابستگی
  const result = db.prepare('DELETE FROM task_dependencies WHERE id = ?').run(dependencyId);
  
  if (result.changes === 0) {
    throw new Error('خطا در حذف وابستگی');
  }
  
  res.json({
    message: 'وابستگی با موفقیت حذف شد',
    deleted_dependency: existing,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/dependencies/graph - نمودار وابستگی‌ها برای visualization
router.get('/graph', asyncHandler(async (req, res) => {
  const db = getDb();
  
  // دریافت تمام تسک‌ها
  const tasks = db.prepare(`
    SELECT id, title, status, progress_percent, owner, project, module
    FROM tasks
    ORDER BY id
  `).all();
  
  // دریافت تمام وابستگی‌ها
  const dependencies = db.prepare(`
    SELECT 
      id, task_id, depends_on_task_id, dependency_type,
      task_title, depends_on_title, dependency_color
    FROM task_dependencies_view
  `).all();
  
  // ایجاد nodes و edges برای نمودار
  const nodes = tasks.map(task => ({
    id: task.id,
    label: task.title,
    status: task.status,
    progress: task.progress_percent,
    owner: task.owner,
    project: task.project,
    module: task.module,
    type: 'task'
  }));
  
  const edges = dependencies.map(dep => ({
    id: dep.id,
    source: dep.depends_on_task_id,
    target: dep.task_id,
    type: dep.dependency_type,
    color: dep.dependency_color,
    label: dep.dependency_type
  }));
  
  res.json({
    graph: {
      nodes,
      edges
    },
    statistics: {
      total_tasks: tasks.length,
      total_dependencies: dependencies.length,
      tasks_with_dependencies: new Set([
        ...dependencies.map(d => d.task_id),
        ...dependencies.map(d => d.depends_on_task_id)
      ]).size
    },
    timestamp: new Date().toISOString()
  });
}));

// GET /api/dependencies/history/:taskId - تاریخچه تغییرات وابستگی‌های یک تسک
router.get('/history/:taskId', asyncHandler(async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  if (isNaN(taskId)) {
    throw new ValidationError('شناسه تسک نامعتبر است');
  }
  
  const db = getDb();
  
  const history = db.prepare(`
    SELECT * FROM task_dependency_history 
    WHERE task_id = ? OR depends_on_task_id = ?
    ORDER BY changed_at DESC
    LIMIT 100
  `).all(taskId, taskId);
  
  res.json({
    task_id: taskId,
    history,
    count: history.length,
    timestamp: new Date().toISOString()
  });
}));

export default router;
