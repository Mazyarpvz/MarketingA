import express from 'express';
import { asyncHandler, ValidationError, DatabaseError, NotFoundError } from '../middleware/errorHandler';

const router = express.Router();

// Test validation error
router.get('/validation', asyncHandler(async (req, res) => {
  throw new ValidationError('داده‌های ورودی نامعتبر است', { field: 'test', value: 'invalid' });
}));

// Test database error
router.get('/database', asyncHandler(async (req, res) => {
  throw new DatabaseError('خطا در اتصال به پایگاه داده');
}));

// Test not found error
router.get('/notfound', asyncHandler(async (req, res) => {
  throw new NotFoundError('آیتم مورد نظر یافت نشد');
}));

// Test generic error
router.get('/generic', asyncHandler(async (req, res) => {
  throw new Error('یک خطای عمومی رخ داده است');
}));

// Test async error
router.get('/async', asyncHandler(async (req, res) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('خطای async'));
    }, 100);
  });
}));

// Test timeout simulation
router.get('/timeout', asyncHandler(async (req, res) => {
  const error = new Error('Connection timeout');
  error.message = 'ETIMEDOUT: Connection timeout';
  throw error;
}));

// Test success case
router.get('/success', asyncHandler(async (req, res) => {
  res.json({ 
    message: 'تست موفقیت‌آمیز بود',
    timestamp: new Date().toISOString()
  });
}));

export default router;
