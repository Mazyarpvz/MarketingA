import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { getDb } from '../db';

// Import routes
import metaRouter from '../routes/meta';
import kpiRouter from '../routes/kpi';
import tasksRouter from '../routes/tasks';
import overdueRouter from '../routes/overdue';
import dueThisWeekRouter from '../routes/dueThisWeek';

// Create test app
const createTestApp = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.use('/api/meta', metaRouter);
  app.use('/api/kpi', kpiRouter);
  app.use('/api/tasks', tasksRouter);
  app.use('/api/overdue', overdueRouter);
  app.use('/api/due-this-week', dueThisWeekRouter);
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'سرور در حال اجرا است' });
  });
  
  return app;
};

describe('API Tests', () => {
  let app: express.Application;
  
  beforeAll(() => {
    app = createTestApp();
  });

  describe('Health Check', () => {
    it('should return OK status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
        
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('سرور در حال اجرا است');
    });
  });

  describe('KPI Endpoint', () => {
    it('should return KPI data', async () => {
      const response = await request(app)
        .get('/api/kpi')
        .expect(200);
        
      expect(response.body).toHaveProperty('total_tasks');
      expect(response.body).toHaveProperty('done');
      expect(response.body).toHaveProperty('in_progress');
      expect(response.body).toHaveProperty('blocked');
      expect(response.body).toHaveProperty('overdue_count');
      expect(response.body).toHaveProperty('due_this_week_count');
      expect(response.body).toHaveProperty('avg_progress');
      
      expect(typeof response.body.total_tasks).toBe('number');
      expect(typeof response.body.avg_progress).toBe('number');
    });
  });

  describe('Meta Endpoint', () => {
    it('should return meta data with owners, statuses, projects, and modules', async () => {
      const response = await request(app)
        .get('/api/meta')
        .expect(200);
        
      expect(response.body).toHaveProperty('owners');
      expect(response.body).toHaveProperty('statuses');
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('modules');
      
      expect(Array.isArray(response.body.owners)).toBe(true);
      expect(Array.isArray(response.body.statuses)).toBe(true);
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(Array.isArray(response.body.modules)).toBe(true);
    });
  });

  describe('Tasks Endpoint', () => {
    it('should return tasks data', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);
        
      expect(response.body).toHaveProperty('rows');
      expect(Array.isArray(response.body.rows)).toBe(true);
      
      if (response.body.rows.length > 0) {
        const task = response.body.rows[0];
        expect(task).toHaveProperty('task_id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('owner');
        expect(task).toHaveProperty('status');
      }
    });

    it('should handle query parameters', async () => {
      const response = await request(app)
        .get('/api/tasks?limit=5&offset=0')
        .expect(200);
        
      expect(response.body).toHaveProperty('rows');
      expect(Array.isArray(response.body.rows)).toBe(true);
    });
  });

  describe('Overdue Tasks Endpoint', () => {
    it('should return overdue tasks', async () => {
      const response = await request(app)
        .get('/api/overdue')
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const overdueTask = response.body[0];
        expect(overdueTask).toHaveProperty('task_id');
        expect(overdueTask).toHaveProperty('title');
        expect(overdueTask).toHaveProperty('due_at');
        expect(overdueTask).toHaveProperty('days_overdue');
      }
    });
  });

  describe('Due This Week Endpoint', () => {
    it('should return tasks due this week', async () => {
      const response = await request(app)
        .get('/api/due-this-week')
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const dueTask = response.body[0];
        expect(dueTask).toHaveProperty('task_id');
        expect(dueTask).toHaveProperty('title');
        expect(dueTask).toHaveProperty('due_at');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent endpoints', async () => {
      await request(app)
        .get('/api/non-existent')
        .expect(404);
    });
  });
});
