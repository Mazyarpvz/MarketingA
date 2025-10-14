import express from 'express';
import cors from 'cors';
import { getDb, closeDb } from './db';

// Import routes
import metaRouter from './routes/meta';
import kpiRouter from './routes/kpi';
import statusCountsRouter from './routes/statusCounts';
import ownerCountsRouter from './routes/ownerCounts';
import overdueRouter from './routes/overdue';
import dueThisWeekRouter from './routes/dueThisWeek';
import tasksRouter from './routes/tasks';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Initialize database
getDb();

// Routes
app.use('/api/meta', metaRouter);
app.use('/api/kpi', kpiRouter);
app.use('/api/status-counts', statusCountsRouter);
app.use('/api/owner-counts', ownerCountsRouter);
app.use('/api/overdue', overdueRouter);
app.use('/api/due-this-week', dueThisWeekRouter);
app.use('/api/tasks', tasksRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'سرور در حال اجرا است' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  res.status(500).json({ error: 'خطای داخلی سرور' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'مسیر یافت نشد' });
});

app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} در حال اجرا است`);
  console.log(`📊 API در دسترس است: http://localhost:${PORT}/api`);
  console.log(`💾 دیتابیس: ${process.env.DB_PATH || './project_dashboard.db'}`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} دریافت شد. در حال بستن سرور...`);
  closeDb();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
