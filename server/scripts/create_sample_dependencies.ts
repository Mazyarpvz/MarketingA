import Database from 'better-sqlite3';

console.log('🚀 شروع ایجاد dependencies نمونه...');

// اتصال به دیتابیس
const db = new Database('./project_dashboard.db');

try {
  // ابتدا بیایید ببینیم چه تسک‌هایی داریم
  const tasks = db.prepare('SELECT task_id, title FROM task LIMIT 10').all();
  console.log('تسک‌های موجود:');
  tasks.forEach(task => {
    console.log(`- ${task.task_id}: ${task.title}`);
  });
  
  if (tasks.length < 2) {
    console.log('❌ تسک‌های کافی برای ایجاد وابستگی وجود ندارد');
    process.exit(1);
  }
  
  // بررسی وابستگی‌های موجود
  const existingDeps = db.prepare('SELECT COUNT(*) as count FROM task_dependencies').get();
  console.log(`\nتعداد وابستگی‌های موجود: ${existingDeps.count}`);
  
  // ایجاد چند وابستگی نمونه
  const insertDep = db.prepare(`
    INSERT INTO task_dependencies (task_id, depends_on_task_id, dependency_type, notes, created_by)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const sampleDeps = [
    {
      task_id: tasks[1].task_id,
      depends_on_task_id: tasks[0].task_id,
      dependency_type: 'finish_to_start',
      notes: 'تسک دوم باید بعد از اتمام تسک اول شروع شود'
    },
    {
      task_id: tasks[2]?.task_id,
      depends_on_task_id: tasks[1]?.task_id,
      dependency_type: 'start_to_start',
      notes: 'تسک سوم همزمان با شروع تسک دوم شروع می‌شود'
    },
    {
      task_id: tasks[3]?.task_id,
      depends_on_task_id: tasks[2]?.task_id,
      dependency_type: 'blocks',
      notes: 'تسک سوم مانع پیشرفت تسک چهارم است'
    }
  ];
  
  let addedCount = 0;
  sampleDeps.forEach((dep, index) => {
    if (!dep.task_id || !dep.depends_on_task_id) {
      console.log(`⚠️ تسک‌های کافی برای وابستگی ${index + 1} وجود ندارد`);
      return;
    }
    
    // بررسی عدم وجود وابستگی تکراری
    const existing = db.prepare(`
      SELECT id FROM task_dependencies 
      WHERE task_id = ? AND depends_on_task_id = ?
    `).get(dep.task_id, dep.depends_on_task_id);
    
    if (existing) {
      console.log(`⚠️ وابستگی بین تسک ${dep.task_id} و ${dep.depends_on_task_id} قبلاً وجود دارد`);
      return;
    }
    
    try {
      insertDep.run(
        dep.task_id,
        dep.depends_on_task_id,
        dep.dependency_type,
        dep.notes,
        'system'
      );
      console.log(`✅ وابستگی ${dep.dependency_type} بین تسک ${dep.task_id} و ${dep.depends_on_task_id} ایجاد شد`);
      addedCount++;
    } catch (error) {
      console.error(`❌ خطا در ایجاد وابستگی ${index + 1}:`, error.message);
    }
  });
  
  console.log(`\n✅ ${addedCount} وابستگی جدید ایجاد شد`);
  
  // نمایش وابستگی‌های جدید
  const newDeps = db.prepare(`
    SELECT * FROM task_dependencies_view 
    ORDER BY created_at DESC 
    LIMIT ?
  `).all(addedCount);
  
  console.log('\nوابستگی‌های ایجاد شده:');
  newDeps.forEach(dep => {
    console.log(`- ${dep.task_title} ${dep.dependency_label} ${dep.depends_on_title}`);
  });
  
} catch (error) {
  console.error('❌ خطا:', error);
  process.exit(1);
} finally {
  db.close();
}

console.log('\n✅ پایان عملیات');