import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = process.env.DB_PATH || './project_dashboard.db';
    const fullPath = path.resolve(dbPath);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    db = new Database(fullPath);
    
    // Configure SQLite for better performance and reliability
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL'); // Better performance while maintaining safety
    db.pragma('cache_size = -64000'); // 64MB cache
    db.pragma('temp_store = MEMORY'); // Store temp tables in memory
    db.pragma('mmap_size = 30000000000'); // 30GB memory-mapped I/O
    db.pragma('page_size = 4096'); // Optimal page size
    
    // Initialize database schema
    initializeSchema();
  }
  
  return db;
}

// Graceful shutdown
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    console.log('✅ Database connection closed');
  }
}

function initializeSchema() {
  if (!db) return;
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS project (
      project_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS module (
      module_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES project(project_id)
    );
    
    CREATE TABLE IF NOT EXISTS team (
      team_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS owner (
      owner_id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL,
      FOREIGN KEY (team_id) REFERENCES team(team_id)
    );
    
    CREATE TABLE IF NOT EXISTS status (
      status_id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE
    );
    
    CREATE TABLE IF NOT EXISTS task (
      task_id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_system TEXT NOT NULL,
      external_task_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      project_id INTEGER NOT NULL,
      module_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES project(project_id),
      FOREIGN KEY (module_id) REFERENCES module(module_id)
    );
    
    CREATE TABLE IF NOT EXISTS task_dates (
      task_id INTEGER PRIMARY KEY,
      start_at TEXT,
      due_at TEXT,
      closed_at TEXT,
      FOREIGN KEY (task_id) REFERENCES task(task_id)
    );
    
    CREATE TABLE IF NOT EXISTS task_assignment (
      task_id INTEGER NOT NULL,
      owner_id INTEGER NOT NULL,
      valid_from TEXT NOT NULL DEFAULT (datetime('now')),
      valid_to TEXT,
      PRIMARY KEY (task_id, owner_id, valid_from),
      FOREIGN KEY (task_id) REFERENCES task(task_id),
      FOREIGN KEY (owner_id) REFERENCES owner(owner_id)
    );
    
    CREATE TABLE IF NOT EXISTS task_status_history (
      task_id INTEGER NOT NULL,
      status_id INTEGER NOT NULL,
      progress_percent INTEGER NOT NULL DEFAULT 0,
      changed_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (task_id, changed_at),
      FOREIGN KEY (task_id) REFERENCES task(task_id),
      FOREIGN KEY (status_id) REFERENCES status(status_id)
    );
    
    CREATE TABLE IF NOT EXISTS fact_task_daily (
      date_key INTEGER NOT NULL,
      task_id INTEGER NOT NULL,
      status_id INTEGER NOT NULL,
      owner_id INTEGER NOT NULL,
      progress_percent INTEGER NOT NULL,
      is_overdue INTEGER NOT NULL DEFAULT 0,
      days_overdue INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (date_key, task_id),
      FOREIGN KEY (task_id) REFERENCES task(task_id),
      FOREIGN KEY (status_id) REFERENCES status(status_id),
      FOREIGN KEY (owner_id) REFERENCES owner(owner_id)
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_task_status_history_task_id_changed_at 
    ON task_status_history(task_id, changed_at DESC);
    
    CREATE INDEX IF NOT EXISTS idx_task_status_history_status_id
    ON task_status_history(status_id);
    
    CREATE INDEX IF NOT EXISTS idx_task_assignment_task_id_valid_from 
    ON task_assignment(task_id, valid_from DESC);
    
    CREATE INDEX IF NOT EXISTS idx_task_assignment_owner_id
    ON task_assignment(owner_id);
    
    CREATE INDEX IF NOT EXISTS idx_task_dates_due_at 
    ON task_dates(due_at);
    
    CREATE INDEX IF NOT EXISTS idx_task_dates_start_at
    ON task_dates(start_at);
    
    CREATE INDEX IF NOT EXISTS idx_task_project_module 
    ON task(project_id, module_id);
    
    CREATE INDEX IF NOT EXISTS idx_task_external_id
    ON task(source_system, external_task_id);
    
    CREATE INDEX IF NOT EXISTS idx_fact_task_daily_date_status
    ON fact_task_daily(date_key, status_id);
    
    CREATE INDEX IF NOT EXISTS idx_fact_task_daily_owner
    ON fact_task_daily(owner_id, date_key);
    
    CREATE INDEX IF NOT EXISTS idx_module_project
    ON module(project_id);
  `);
  
  // Insert default statuses
  const statuses = ['Open', 'In Progress', 'Review', 'On Hold', 'Blocked', 'Done'];
  const insertStatus = db.prepare('INSERT OR IGNORE INTO status (code) VALUES (?)');
  statuses.forEach(status => insertStatus.run(status));
  
  // Insert sample data if tables are empty
  insertSampleData();
}

function insertSampleData() {
  if (!db) return;
  
  // Check if we already have data
  const taskCount = db.prepare('SELECT COUNT(*) as count FROM task').get() as { count: number };
  if (taskCount.count > 0) return;
  
  // Insert sample projects
  const insertProject = db.prepare('INSERT INTO project (name) VALUES (?)');
  const projectIds = [
    insertProject.run('پروژه مدیریت فروش').lastInsertRowid,
    insertProject.run('پروژه توسعه وب').lastInsertRowid,
    insertProject.run('پروژه اپلیکیشن موبایل').lastInsertRowid,
  ];
  
  // Insert sample modules
  const insertModule = db.prepare('INSERT INTO module (project_id, name) VALUES (?, ?)');
  const moduleIds = [
    insertModule.run(projectIds[0], 'ماژول فروش').lastInsertRowid,
    insertModule.run(projectIds[0], 'ماژول گزارش‌گیری').lastInsertRowid,
    insertModule.run(projectIds[1], 'ماژول فرانت‌اند').lastInsertRowid,
    insertModule.run(projectIds[1], 'ماژول بک‌اند').lastInsertRowid,
    insertModule.run(projectIds[2], 'ماژول iOS').lastInsertRowid,
    insertModule.run(projectIds[2], 'ماژول Android').lastInsertRowid,
  ];
  
  // Insert sample teams
  const insertTeam = db.prepare('INSERT INTO team (name) VALUES (?)');
  const teamIds = [
    insertTeam.run('تیم فروش').lastInsertRowid,
    insertTeam.run('تیم توسعه').lastInsertRowid,
    insertTeam.run('تیم QA').lastInsertRowid,
  ];
  
  // Insert sample owners
  const insertOwner = db.prepare('INSERT INTO owner (team_id, display_name, email) VALUES (?, ?, ?)');
  const ownerIds = [
    insertOwner.run(teamIds[0], 'احمد محمدی', 'ahmad@example.com').lastInsertRowid,
    insertOwner.run(teamIds[0], 'فاطمه احمدی', 'fateme@example.com').lastInsertRowid,
    insertOwner.run(teamIds[1], 'علی رضایی', 'ali@example.com').lastInsertRowid,
    insertOwner.run(teamIds[1], 'مریم حسینی', 'maryam@example.com').lastInsertRowid,
    insertOwner.run(teamIds[2], 'حسن کریمی', 'hasan@example.com').lastInsertRowid,
  ];
  
  // Insert sample tasks
  const insertTask = db.prepare(`
    INSERT INTO task (source_system, external_task_id, title, description, project_id, module_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const taskIds = [
    insertTask.run('JIRA', 'PROJ-001', 'طراحی رابط کاربری فروش', 'طراحی UI/UX برای بخش فروش', projectIds[0], moduleIds[0], lastWeek).lastInsertRowid,
    insertTask.run('JIRA', 'PROJ-002', 'پیاده‌سازی API فروش', 'توسعه API برای مدیریت فروش', projectIds[0], moduleIds[0], lastWeek).lastInsertRowid,
    insertTask.run('JIRA', 'PROJ-003', 'گزارش فروش ماهانه', 'تهیه گزارش عملکرد فروش', projectIds[0], moduleIds[1], yesterday).lastInsertRowid,
    insertTask.run('JIRA', 'PROJ-004', 'توسعه صفحه اصلی', 'طراحی و پیاده‌سازی صفحه اصلی', projectIds[1], moduleIds[2], lastWeek).lastInsertRowid,
    insertTask.run('JIRA', 'PROJ-005', 'اتصال به دیتابیس', 'پیاده‌سازی اتصال به دیتابیس', projectIds[1], moduleIds[3], yesterday).lastInsertRowid,
    insertTask.run('JIRA', 'PROJ-006', 'تست عملکرد اپ', 'تست کامل عملکرد اپلیکیشن', projectIds[2], moduleIds[4], now).lastInsertRowid,
  ];
  
  // Insert task dates
  const insertTaskDates = db.prepare(`
    INSERT INTO task_dates (task_id, start_at, due_at, closed_at)
    VALUES (?, ?, ?, ?)
  `);
  
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const overdue = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  
  insertTaskDates.run(taskIds[0], lastWeek, nextWeek, null);
  insertTaskDates.run(taskIds[1], lastWeek, tomorrow, null);
  insertTaskDates.run(taskIds[2], yesterday, overdue, null); // Overdue
  insertTaskDates.run(taskIds[3], lastWeek, nextWeek, null);
  insertTaskDates.run(taskIds[4], yesterday, tomorrow, null);
  insertTaskDates.run(taskIds[5], now, nextWeek, null);
  
  // Insert task assignments
  const insertAssignment = db.prepare(`
    INSERT INTO task_assignment (task_id, owner_id, valid_from)
    VALUES (?, ?, ?)
  `);
  
  insertAssignment.run(taskIds[0], ownerIds[0], lastWeek);
  insertAssignment.run(taskIds[1], ownerIds[1], lastWeek);
  insertAssignment.run(taskIds[2], ownerIds[0], yesterday);
  insertAssignment.run(taskIds[3], ownerIds[2], lastWeek);
  insertAssignment.run(taskIds[4], ownerIds[3], yesterday);
  insertAssignment.run(taskIds[5], ownerIds[4], now);
  
  // Insert status history
  const insertStatusHistory = db.prepare(`
    INSERT INTO task_status_history (task_id, status_id, progress_percent, changed_at)
    VALUES (?, ?, ?, ?)
  `);
  
  const getStatusId = db.prepare('SELECT status_id FROM status WHERE code = ?');
  const openStatusId = (getStatusId.get('Open') as { status_id: number }).status_id;
  const inProgressStatusId = (getStatusId.get('In Progress') as { status_id: number }).status_id;
  const doneStatusId = (getStatusId.get('Done') as { status_id: number }).status_id;
  const blockedStatusId = (getStatusId.get('Blocked') as { status_id: number }).status_id;
  
  insertStatusHistory.run(taskIds[0], openStatusId, 0, lastWeek);
  insertStatusHistory.run(taskIds[0], inProgressStatusId, 30, yesterday);
  
  insertStatusHistory.run(taskIds[1], openStatusId, 0, lastWeek);
  insertStatusHistory.run(taskIds[1], inProgressStatusId, 60, yesterday);
  
  insertStatusHistory.run(taskIds[2], openStatusId, 0, yesterday);
  insertStatusHistory.run(taskIds[2], blockedStatusId, 0, now);
  
  insertStatusHistory.run(taskIds[3], openStatusId, 0, lastWeek);
  insertStatusHistory.run(taskIds[3], inProgressStatusId, 80, yesterday);
  
  insertStatusHistory.run(taskIds[4], openStatusId, 0, yesterday);
  insertStatusHistory.run(taskIds[4], inProgressStatusId, 40, now);
  
  insertStatusHistory.run(taskIds[5], openStatusId, 0, now);
}
