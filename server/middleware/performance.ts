import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

// In-memory store for performance metrics (in production, use Redis or database)
const performanceMetrics: PerformanceMetrics[] = [];
const MAX_METRICS = 1000; // Keep last 1000 requests

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const metric: PerformanceMetrics = {
      endpoint: req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Store metric
    performanceMetrics.push(metric);
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.shift(); // Remove oldest
    }
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`🐌 Slow query detected:`, {
        endpoint: req.path,
        method: req.method,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        query: req.query,
        body: req.method === 'POST' ? req.body : undefined
      });
    }
    
    // Log errors
    if (res.statusCode >= 400) {
      console.error(`❌ Error response:`, {
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        query: req.query
      });
    }
    
    // Log success for important endpoints
    if (res.statusCode < 400 && duration > 500) {
      console.info(`⚡ Performance info:`, {
        endpoint: req.path,
        method: req.method,
        duration: `${duration}ms`,
        statusCode: res.statusCode
      });
    }
  });
  
  next();
};

export const getPerformanceMetrics = () => {
  const now = Date.now();
  const last5Minutes = performanceMetrics.filter(m => 
    now - new Date(m.timestamp).getTime() < 5 * 60 * 1000
  );
  
  const last1Hour = performanceMetrics.filter(m => 
    now - new Date(m.timestamp).getTime() < 60 * 60 * 1000
  );
  
  // Calculate averages
  const avgDuration5Min = last5Minutes.length > 0 
    ? last5Minutes.reduce((sum, m) => sum + m.duration, 0) / last5Minutes.length 
    : 0;
    
  const avgDuration1Hour = last1Hour.length > 0 
    ? last1Hour.reduce((sum, m) => sum + m.duration, 0) / last1Hour.length 
    : 0;
  
  // Count errors
  const errors5Min = last5Minutes.filter(m => m.statusCode >= 400).length;
  const errors1Hour = last1Hour.filter(m => m.statusCode >= 400).length;
  
  // Slowest endpoints
  const slowestEndpoints = [...performanceMetrics]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10)
    .map(m => ({
      endpoint: m.endpoint,
      method: m.method,
      duration: m.duration,
      timestamp: m.timestamp
    }));
  
  // Most requested endpoints
  const endpointCounts = performanceMetrics.reduce((acc, m) => {
    const key = `${m.method} ${m.endpoint}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostRequested = Object.entries(endpointCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([endpoint, count]) => ({ endpoint, count }));
  
  return {
    summary: {
      totalRequests: performanceMetrics.length,
      last5Minutes: {
        requests: last5Minutes.length,
        averageDuration: Math.round(avgDuration5Min),
        errors: errors5Min,
        errorRate: last5Minutes.length > 0 ? (errors5Min / last5Minutes.length * 100).toFixed(2) : '0'
      },
      last1Hour: {
        requests: last1Hour.length,
        averageDuration: Math.round(avgDuration1Hour),
        errors: errors1Hour,
        errorRate: last1Hour.length > 0 ? (errors1Hour / last1Hour.length * 100).toFixed(2) : '0'
      }
    },
    slowestEndpoints,
    mostRequested,
    recentRequests: performanceMetrics.slice(-20).reverse() // Last 20 requests
  };
};
