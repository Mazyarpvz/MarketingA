import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 شروع ایجاد views...');

// اتصال به دیتابیس
const db = new Database('./project_dashboard.db');

try {
  // خواندن فایل migration
  const migrationPath = join(__dirname, '..', 'migrations', 'create_dependency_views.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  
  // اجرای migration
  db.exec(migrationSQL);
  
  console.log('✅ Views با موفقیت ایجاد شدند');
  
  // بررسی views
  const views = db.prepare("SELECT name FROM sqlite_master WHERE type='view'").all();
  console.log('Views ایجاد شده:');
  views.forEach(view => {
    console.log(`- ${view.name}`);
  });
  
} catch (error) {
  console.error('❌ خطا در ایجاد views:', error);
  process.exit(1);
} finally {
  db.close();
}

console.log('✅ پایان عملیات');
