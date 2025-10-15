-- Create views for task dependencies

-- ایجاد ویو برای نمایش اطلاعات کامل وابستگی‌ها
CREATE VIEW IF NOT EXISTS task_dependencies_view AS
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

-- ایجاد ویو برای task با اطلاعات کامل‌تر
CREATE VIEW IF NOT EXISTS tasks AS
SELECT 
    t.task_id AS id,
    t.title,
    t.description,
    p.name AS project,
    m.name AS module,
    o.display_name AS owner,
    s.code AS status,
    tsh.progress_percent,
    td.start_at,
    td.due_at,
    td.closed_at,
    t.created_at
FROM task t
LEFT JOIN project p ON t.project_id = p.project_id
LEFT JOIN module m ON t.module_id = m.module_id
LEFT JOIN task_assignment ta ON t.task_id = ta.task_id AND ta.valid_to IS NULL
LEFT JOIN owner o ON ta.owner_id = o.owner_id
LEFT JOIN (
    SELECT task_id, status_id, progress_percent,
           ROW_NUMBER() OVER (PARTITION BY task_id ORDER BY changed_at DESC) AS rn
    FROM task_status_history
) tsh ON t.task_id = tsh.task_id AND tsh.rn = 1
LEFT JOIN status s ON tsh.status_id = s.status_id
LEFT JOIN task_dates td ON t.task_id = td.task_id;
