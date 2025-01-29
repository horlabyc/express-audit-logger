export interface AuditLog {
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ip?: string;
  userAgent?: string;
  status?: number;
  method?: string;
  path?: string;
}

export interface AuditLoggerOptions {
  storageProvider: AuditStorageProvider;
  excludePaths?: string[];
  maskSensitiveData?: boolean;
  sensitiveFields?: string[];
}

export interface AuditStorageProvider {
  save(log: AuditLog): Promise<void>;
}