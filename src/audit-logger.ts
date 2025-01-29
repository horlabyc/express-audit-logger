import { Request, Response, NextFunction } from 'express';
import { AuditLog, AuditLoggerOptions } from './types'

export class AuditLogger {
  private options: AuditLoggerOptions

  constructor(options: AuditLoggerOptions) {
    this.options = {
      excludePaths: [],
      maskSensitiveData: false,
      sensitiveFields: [],
      ...options
    };
  }

  private maskSensitiveData(data: Record<string, any>): Record<string, any> {
    if (!this.options.maskSensitiveData) return data
    
    const masked = { ...data };
    for (const field of this.options.sensitiveFields || []) {
      if (masked[field]) {
        masked[field] = '***';
      }
    }
    return masked;
  }

  private shouldExcludePath(path: string): boolean {
    return (this.options.excludePaths || []).some(
      excludePath => path.startsWith(excludePath)
    )
  }

  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (this.shouldExcludePath(req.path)) {
        return next()
      }

      const startTime = process.hrtime();

      const maskSensitiveData = this.maskSensitiveData.bind(this)
      const storageProvider = this.options.storageProvider

      res.on('finish', () => {
        const diff = process.hrtime(startTime);
        const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        const log: AuditLog = {
          timestamp: new Date(),
          userId: (req as any).user?.id,
          action: `${req.method} ${req.path}`,
          resource: req.path,
          details: {
            query: req.query,
            params: req.params,
            body: maskSensitiveData(req.body),
            responseTime: `${responseTime}ms`,
          },
          ip: req.ip,
          userAgent: req.get('user-agent'),
          status: res.statusCode,
          method: req.method,
          path: req.path,
        };

        storageProvider.save(log).catch(error => {
          console.error('Failed to save audit log:', error);
        });
      })

      next()
    }
  }

  async log(action: string, details: Record<string, any>) {
    const log: AuditLog = {
      timestamp: new Date(),
      action,
      resource: 'manual',
      details: this.maskSensitiveData(details)
    }
    await this.options.storageProvider.save(log)
  }
  
}