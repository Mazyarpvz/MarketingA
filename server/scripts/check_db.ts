import Database from 'better-sqlite3';

const db = new Database('./project_dashboard.db');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in database:');
tables.forEach(table => {
  console.log(`- ${table.name}`);
  
  // Get columns for each table
  const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
  console.log('  Columns:', columns.map(col => col.name).join(', '));
});

db.close();
