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
import debugRouter from './routes/debug';
import performanceRouter from './routes/performance';
import testErrorRouter from './routes/test-error';
import dependenciesRouter from './routes/dependencies';

// Import middleware
import { performanceMiddleware } from './middleware/performance';
import { errorHandler, notFoundHandler, gracefulShutdown } from './middleware/errorHandler';

const app = express();
const PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 3002);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Performance monitoring middleware
app.use(performanceMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  let bodyPreview = '';
  try {
    bodyPreview = req.body ? `Body: ${JSON.stringify(req.body).slice(0, 200)}` : '';
  } catch {
    bodyPreview = '[unserializable body]';
  }
  console.log(`📨 Incoming: ${req.method} ${req.path} ${bodyPreview}`);
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
app.use('/api/debug', debugRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/dependencies', dependenciesRouter);

// Test routes (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/test-error', testErrorRouter);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'سرور در حال اجرا است' });
});

// 404 handler (must be before error handler)
app.use('*', notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} در حال اجرا است`);
  console.log(`📊 API در دسترس است: http://localhost:${PORT}/api`);
  console.log(`💾 دیتابیس: ${process.env.DB_PATH || './project_dashboard.db'}`);
});

// Setup graceful shutdown
gracefulShutdown(server);

