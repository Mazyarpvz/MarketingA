import { getDb } from '../db';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  try {
    const db = getDb();
    
    // خواندن فایل migration
    const migrationPath = path.join(__dirname, '../migrations/add_task_dependencies.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // اجرای کل فایل SQL به صورت یکجا
    console.log('🚀 اجرای migration...');
    db.exec(migrationSQL);
    console.log('✅ Migration SQL اجرا شد');
    
    // تست اجرای موفق migration
    const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='task_dependencies'").get();
    if (result) {
      console.log('✅ Migration با موفقیت اجرا شد!');
      console.log('📊 جداول جدید ایجاد شده:');
      
      const tables = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name LIKE '%depend%'
        ORDER BY name
      `).all();
      
      tables.forEach((table: any) => {
        console.log(`   - ${table.name}`);
      });
      
      // نمایش انواع وابستگی ایجاد شده
      const dependencyTypes = db.prepare("SELECT * FROM dependency_types ORDER BY id").all();
      console.log('\n🏷️ انواع وابستگی ایجاد شده:');
      dependencyTypes.forEach((type: any) => {
        console.log(`   - ${type.type_key}: ${type.type_label_fa}`);
      });
      
    } else {
      console.error('❌ Migration ناموفق - جدول task_dependencies ایجاد نشد');
    }
    
  } catch (error) {
    console.error('❌ خطا در اجرای migration:', error);
    process.exit(1);
  }
};

// اجرا فقط اگر مستقیماً صدا زده شود
if (require.main === module) {
  runMigration();
}

export { runMigration };
