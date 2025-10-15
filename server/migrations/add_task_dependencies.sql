-- Migration: Add Task Dependencies
-- Created: 2025-10-15
-- Description: اضافه کردن جدول وابستگی‌های تسک‌ها

-- جدول وابستگی‌های تسک‌ها
CREATE TABLE IF NOT EXISTS task_dependencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    depends_on_task_id INTEGER NOT NULL,
    dependency_type TEXT NOT NULL DEFAULT 'blocks',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT DEFAULT 'system',
    notes TEXT,
    
    -- Foreign Key Constraints
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate dependencies
    UNIQUE(task_id, depends_on_task_id),
    
    -- Check constraint to prevent self-dependency
    CHECK(task_id != depends_on_task_id)
);

-- Index برای جست‌وجوی سریع‌تر
CREATE INDEX IF NOT EXISTS idx_task_dependencies_task_id 
ON task_dependencies(task_id);

CREATE INDEX IF NOT EXISTS idx_task_dependencies_depends_on 
ON task_dependencies(depends_on_task_id);

CREATE INDEX IF NOT EXISTS idx_task_dependencies_type 
ON task_dependencies(dependency_type);

-- جدول انواع وابستگی (lookup table)
CREATE TABLE IF NOT EXISTS dependency_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_key TEXT UNIQUE NOT NULL,
    type_label_fa TEXT NOT NULL,
    type_label_en TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7280',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- درج انواع وابستگی پیش‌فرض
INSERT OR IGNORE INTO dependency_types (type_key, type_label_fa, type_label_en, description, color) VALUES
('blocks', 'مسدود کننده', 'Blocks', 'این تسک مانع شروع تسک دیگر است', '#EF4444'),
('finish_to_start', 'پایان به شروع', 'Finish to Start', 'تسک دوم نمی‌تواند شروع شود تا تسک اول تمام نشود', '#3B82F6'),
('start_to_start', 'شروع به شروع', 'Start to Start', 'هر دو تسک باید همزمان شروع شوند', '#10B981'),
('finish_to_finish', 'پایان به پایان', 'Finish to Finish', 'هر دو تسک باید همزمان تمام شوند', '#F59E0B'),
('related', 'مرتبط', 'Related', 'تسک‌ها با هم ارتباط دارند اما وابستگی سخت ندارند', '#8B5CF6');

-- جدول تاریخچه تغییرات وابستگی‌ها
CREATE TABLE IF NOT EXISTS task_dependency_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    depends_on_task_id INTEGER,
    dependency_type TEXT,
    action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    changed_by TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- View برای نمایش وابستگی‌ها با جزئیات تسک‌ها
CREATE VIEW IF NOT EXISTS task_dependencies_view AS
SELECT 
    td.id,
    td.task_id,
    td.depends_on_task_id,
    td.dependency_type,
    td.created_at,
    td.created_by,
    td.notes,
    
    -- اطلاعات تسک اصلی
    t1.title as task_title,
    t1.status as task_status,
    t1.progress_percent as task_progress,
    t1.owner as task_owner,
    
    -- اطلاعات تسک وابسته
    t2.title as depends_on_title,
    t2.status as depends_on_status,
    t2.progress_percent as depends_on_progress,
    t2.owner as depends_on_owner,
    
    -- اطلاعات نوع وابستگی
    dt.type_label_fa,
    dt.type_label_en,
    dt.color as dependency_color,
    dt.description as dependency_description
    
FROM task_dependencies td
LEFT JOIN tasks t1 ON td.task_id = t1.id
LEFT JOIN tasks t2 ON td.depends_on_task_id = t2.id
LEFT JOIN dependency_types dt ON td.dependency_type = dt.type_key;

-- Trigger برای ثبت تاریخچه تغییرات
CREATE TRIGGER IF NOT EXISTS task_dependencies_history_insert
AFTER INSERT ON task_dependencies
BEGIN
    INSERT INTO task_dependency_history (
        task_id, depends_on_task_id, dependency_type, action, new_values, changed_by
    ) VALUES (
        NEW.task_id, NEW.depends_on_task_id, NEW.dependency_type, 'created',
        json_object(
            'task_id', NEW.task_id,
            'depends_on_task_id', NEW.depends_on_task_id,
            'dependency_type', NEW.dependency_type,
            'notes', NEW.notes
        ),
        NEW.created_by
    );
END;

CREATE TRIGGER IF NOT EXISTS task_dependencies_history_update
AFTER UPDATE ON task_dependencies
BEGIN
    INSERT INTO task_dependency_history (
        task_id, depends_on_task_id, dependency_type, action, old_values, new_values, changed_by
    ) VALUES (
        NEW.task_id, NEW.depends_on_task_id, NEW.dependency_type, 'updated',
        json_object(
            'task_id', OLD.task_id,
            'depends_on_task_id', OLD.depends_on_task_id,
            'dependency_type', OLD.dependency_type,
            'notes', OLD.notes
        ),
        json_object(
            'task_id', NEW.task_id,
            'depends_on_task_id', NEW.depends_on_task_id,
            'dependency_type', NEW.dependency_type,
            'notes', NEW.notes
        ),
        'system'
    );
END;

CREATE TRIGGER IF NOT EXISTS task_dependencies_history_delete
AFTER DELETE ON task_dependencies
BEGIN
    INSERT INTO task_dependency_history (
        task_id, depends_on_task_id, dependency_type, action, old_values, changed_by
    ) VALUES (
        OLD.task_id, OLD.depends_on_task_id, OLD.dependency_type, 'deleted',
        json_object(
            'task_id', OLD.task_id,
            'depends_on_task_id', OLD.depends_on_task_id,
            'dependency_type', OLD.dependency_type,
            'notes', OLD.notes
        ),
        'system'
    );
END;
