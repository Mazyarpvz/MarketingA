-- حذف جدول قدیمی و ایجاد مجدد با foreign key صحیح

BEGIN TRANSACTION;

-- حذف view وابسته
DROP VIEW IF EXISTS task_dependencies_view;

-- حذف جدول قدیمی
DROP TABLE IF EXISTS task_dependencies;

-- ایجاد مجدد جدول با foreign key صحیح
CREATE TABLE task_dependencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    depends_on_task_id INTEGER NOT NULL,
    dependency_type TEXT NOT NULL DEFAULT 'blocks',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT DEFAULT 'system',
    notes TEXT,
    FOREIGN KEY (task_id) REFERENCES task(task_id),
    FOREIGN KEY (depends_on_task_id) REFERENCES task(task_id),
    FOREIGN KEY (dependency_type) REFERENCES dependency_types(type_key),
    UNIQUE(task_id, depends_on_task_id)
);

-- ایجاد indexes
CREATE INDEX idx_task_dependencies_task_id ON task_dependencies(task_id);
CREATE INDEX idx_task_dependencies_depends_on ON task_dependencies(depends_on_task_id);
CREATE INDEX idx_task_dependencies_type ON task_dependencies(dependency_type);

-- ایجاد مجدد view
CREATE VIEW task_dependencies_view AS
SELECT 
    td.id,
    td.task_id,
    td.depends_on_task_id,
    td.dependency_type,
    td.created_at,
    td.created_by,
    td.notes,
    t1.title AS task_title,
    t2.title AS depends_on_title,
    dt.type_label_fa AS dependency_label,
    dt.color AS dependency_color
FROM task_dependencies td
JOIN task t1 ON td.task_id = t1.task_id
JOIN task t2 ON td.depends_on_task_id = t2.task_id
LEFT JOIN dependency_types dt ON td.dependency_type = dt.type_key;

COMMIT;
