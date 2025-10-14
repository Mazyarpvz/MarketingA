import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Middleware برای اعتبارسنجی query parameters
 */
export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'پارامترهای نامعتبر',
        details: result.error.issues,
      });
    }
    
    req.query = result.data;
    next();
  };
}

/**
 * Middleware برای اعتبارسنجی request body
 */
export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'داده‌های ورودی نامعتبر',
        details: result.error.issues,
      });
    }
    
    req.body = result.data;
    next();
  };
}

/**
 * Middleware برای مدیریت خطاهای async
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Logger helper
 */
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`ℹ️ [INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`❌ [ERROR] ${message}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(`⚠️ [WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🔍 [DEBUG] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  },
};

/**
 * Helper برای ساخت query با شرایط dynamic
 */
export class QueryBuilder {
  private conditions: string[] = [];
  private params: any[] = [];

  addCondition(condition: string, ...params: any[]) {
    if (params.every(p => p !== undefined && p !== null && p !== '')) {
      this.conditions.push(condition);
      this.params.push(...params);
    }
    return this;
  }

  getWhereClause() {
    return this.conditions.length > 0 
      ? `WHERE ${this.conditions.join(' AND ')}` 
      : '';
  }

  getParams() {
    return this.params;
  }

  reset() {
    this.conditions = [];
    this.params = [];
    return this;
  }
}

/**
 * Helper برای pagination
 */
export function getPaginationParams(page: string = '1', pageSize: string = '20') {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
  const offset = (pageNum - 1) * pageSizeNum;
  
  return {
    page: pageNum,
    pageSize: pageSizeNum,
    offset,
  };
}

/**
 * Helper برای format کردن تاریخ
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Helper برای sanitize کردن string برای SQL LIKE
 */
export function sanitizeLike(str: string): string {
  return str.replace(/[%_]/g, '\\$&');
}
