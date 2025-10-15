import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
  timestamp?: string;
}

// Custom error classes
export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  statusCode = 500;
  code = 'DATABASE_ERROR';
  
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  code = 'NOT_FOUND';
  
  constructor(message: string = 'منبع یافت نشد') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Error logging utility
const logError = (error: AppError, req: Request) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method === 'POST' ? req.body : undefined,
    query: req.query,
    timestamp: new Date().toISOString()
  };

  if (error.statusCode && error.statusCode >= 500) {
    console.error('🚨 Server Error:', errorInfo);
  } else if (error.statusCode && error.statusCode >= 400) {
    console.warn('⚠️ Client Error:', errorInfo);
  } else {
    console.error('❌ Unhandled Error:', errorInfo);
  }
};

// Main error handler middleware
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error properties
  err.statusCode = err.statusCode || 500;
  err.timestamp = new Date().toISOString();

  // Log the error
  logError(err, req);

  // Handle specific error types
  let message = err.message;
  let details = err.details;

  // SQLite errors
  if (err.message?.includes('SQLITE')) {
    if (err.message.includes('UNIQUE constraint')) {
      err.statusCode = 409;
      message = 'داده تکراری - این مورد قبلاً وجود دارد';
    } else if (err.message.includes('NOT NULL constraint')) {
      err.statusCode = 400;
      message = 'فیلدهای اجباری کامل نشده است';
    } else if (err.message.includes('FOREIGN KEY constraint')) {
      err.statusCode = 400;
      message = 'ارتباط داده‌ای نامعتبر است';
    } else {
      err.statusCode = 500;
      message = 'خطا در پایگاه داده';
    }
  }

  // Validation errors
  if (err.name === 'ValidationError' || err.code === 'VALIDATION_ERROR') {
    err.statusCode = 400;
    message = message || 'داده‌های ورودی نامعتبر است';
  }

  // Network/timeout errors
  if (err.message?.includes('timeout') || err.message?.includes('ETIMEDOUT')) {
    err.statusCode = 408;
    message = 'زمان انتظار تمام شد - لطفاً دوباره تلاش کنید';
  }

  // Response object
  const errorResponse: any = {
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: err.timestamp,
    path: req.path,
    method: req.method
  };

  // Add details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = details;
    errorResponse.stack = err.stack;
    errorResponse.originalMessage = err.message;
  }

  // Add request info for debugging
  if (process.env.NODE_ENV === 'development' && err.statusCode >= 500) {
    errorResponse.request = {
      query: req.query,
      body: req.body,
      headers: req.headers
    };
  }

  res.status(err.statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`مسیر ${req.path} یافت نشد`);
  next(error);
};

// Graceful shutdown helper
export const gracefulShutdown = (server: any) => {
  const shutdown = (signal: string) => {
    console.log(`\n${signal} دریافت شد. در حال بستن سرور...`);
    
    server.close(() => {
      console.log('✅ سرور با موفقیت بسته شد');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ بستن اجباری سرور');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('UNHANDLED_REJECTION');
  });
};
