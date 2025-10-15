import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create simple test app without database dependencies
const createSimpleTestApp = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Simple health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'سرور در حال اجرا است' });
  });
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'مسیر یافت نشد' });
  });
  
  return app;
};

describe('Simple API Tests', () => {
  let app: express.Application;
  
  beforeAll(() => {
    app = createSimpleTestApp();
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

  describe('Error Handling', () => {
    it('should handle 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);
        
      expect(response.body.error).toBe('مسیر یافت نشد');
    });
  });

  describe('CORS', () => {
    it('should have CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
        
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});
