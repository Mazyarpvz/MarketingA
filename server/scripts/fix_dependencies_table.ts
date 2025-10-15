import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 شروع اصلاح جدول dependencies...');

// اتصال به دیتابیس
const db = new Database('./project_dashboard.db');

// فعال کردن foreign keys
db.pragma('foreign_keys = ON');

try {
  // خواندن فایل migration
  const migrationPath = join(__dirname, '..', 'migrations', 'fix_task_dependencies.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  
  // اجرای migration
  db.exec(migrationSQL);
  
  console.log('✅ جدول dependencies با موفقیت اصلاح شد');
  
  // بررسی جدول
  const tableInfo = db.prepare("PRAGMA table_info(task_dependencies)").all();
  console.log('\nستون‌های جدول task_dependencies:');
  tableInfo.forEach(col => {
    console.log(`- ${col.name} (${col.type})`);
  });
  
} catch (error) {
  console.error('❌ خطا در اصلاح جدول:', error);
  process.exit(1);
} finally {
  db.close();
}

console.log('✅ پایان عملیات');
