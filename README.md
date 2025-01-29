# express-audit-logger

[![NPM Version][npm-version-image]][npm-url]

A flexible and powerful audit logging middleware for Express applications built with TypeScript. Track user actions, API activity, and system events with customizable storage providers and extensive configuration options.

## Features
  🚀 Easy to integrate Express middleware
  📝 Automatic HTTP request/response logging
  🔒 Sensitive data masking
  🎯 Path exclusion patterns
  ⏱️ Response time tracking
  🔌 Pluggable storage providers
  📊 Detailed request metadata logging
  🔄 Manual logging capability
  💪 Written in TypeScript with full type support

## Installation
```sh
    npm install express-audit-logger
    # or
    yarn add express-audit-logger
```

## Quick Start
```ts
    import express from 'express';
    import { AuditLogger, ConsoleStorageProvider } from 'express-audit-logger';
    
    const app = express();
    
    // Create an audit logger instance
    const auditLogger = new AuditLogger({
      storageProvider: new ConsoleStorageProvider(),
      maskSensitiveData: true,
      sensitiveFields: ['password', 'token'],
      excludePaths: ['/health', '/metrics']
    });
    
    // Use as middleware
    app.use(auditLogger.middleware());
    
    // Example route with manual logging
    app.post('/users', async (req, res) => {
      // Your business logic here
      await auditLogger.log('CREATE_USER', {
        userId: req.body.id,
        email: req.body.email
      });
      res.send({ success: true });
    });
```

## Configuration Options
The `AuditLogger` constructor accepts an options object with the following properties:
```ts
    interface AuditLoggerOptions {
      storageProvider: AuditStorageProvider;  // Required
      excludePaths?: string[];               // Optional
      maskSensitiveData?: boolean;          // Optional
      sensitiveFields?: string[];           // Optional
    }
```

## Storage providers
The library comes with two built-in storage providers

##### Console Storage Provider
You can use the console storage provider to display your logs on the console
```ts
    import { ConsoleStorageProvider } from 'express-audit-logger';

    const logger = new AuditLogger({
      storageProvider: new ConsoleStorageProvider()
    });
```

##### File Storage Provider
You can use the file storage provider to save your logs in a file
```ts
    import { FileStorageProvider } from 'express-audit-logger';
    
    const logger = new AuditLogger({
      storageProvider: new FileStorageProvider('./audit-logs.txt')
    });
```

##### Custom Storage Provider
You can create your own storage provider by implementing the `AuditStorageProvider` interface:

```ts
    import { AuditLog, AuditStorageProvider } from 'express-audit-logger';
    import { MongoClient } from 'mongodb';
    
    class MongoStorageProvider implements AuditStorageProvider {
      private client: MongoClient;
      private collection: string;
    
      constructor(client: MongoClient, collection: string) {
        this.client = client;
        this.collection = collection;
      }
    
      async save(log: AuditLog): Promise<void> {
        await this.client
          .db()
          .collection(this.collection)
          .insertOne(log);
      }
    }
```

##### Path Exclusion
Exclude specific paths from being logged:

```ts
    const logger = new AuditLogger({
    storageProvider: new ConsoleStorageProvider(),
     excludePaths: [
        '/health',           // Excludes health checks
        '/static',           // Excludes all static files
        '/api/v1/metrics',   // Excludes metrics endpoint
        '/favicon.ico'       // Excludes favicon requests
      ]
    });
```

##### Sensitive Data Masking
Mask sensitive information in logs:

```ts
    const logger = new AuditLogger({
      storageProvider: new ConsoleStorageProvider(),
      maskSensitiveData: true,
      sensitiveFields: ['password', 'token', 'creditCard']
    });
```

##### Log Structure
Each audit log entry contains the following information:

```ts
    interface AuditLog {
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
```

##### Manual Logging
Each audit log entry contains the following information:

```ts
    interface AuditLog {
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
```

##### Error Handling
The logger will never throw errors that could interrupt your application flow. All storage errors are caught and logged to console

```ts
    try {
      await storageProvider.save(log);
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
```

### Examples

##### Basic Setup
Basic express app setup
```ts
    import express from 'express';
    import { AuditLogger, ConsoleStorageProvider } from 'express-audit-logger';
    
    const app = express();
    app.use(express.json());
    
    const logger = new AuditLogger({
      storageProvider: new ConsoleStorageProvider()
    });
    
    app.use(logger.middleware());
```

##### With Database Storage
You can create a custom storage provider (e.g for MongoDB or PostgresQL) by implementing the `AuditStorageProvider` interface
```ts
    import { AuditLog, AuditStorageProvider } from 'express-audit-logger';
    import { MongoClient } from 'mongodb';
    
    export class MongoStorageProvider implements AuditStorageProvider {
      private client: MongoClient;
      private collection: string;
    
      constructor(client: MongoClient, collection: string) {
        this.client = client;
        this.collection = collection;
      }
    
      async save(log: AuditLog): Promise<void> {
        await this.client
          .db()
          .collection(this.collection)
          .insertOne(log);
      }
    }
```

```ts
    import { AuditLogger } from 'express-audit-logger';
    import { MongoStorageProvider } from './mongo-provider';
    import { MongoClient } from 'mongodb';
    
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    
    const logger = new AuditLogger({
      storageProvider: new MongoStorageProvider(client, 'audit_logs')
    });
    
    app.use(logger.middleware())
```

##### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
  
## License

[MIT](LICENSE)

[ci-image]: https://badgen.net/github/checks/expressjs/body-parser/master?label=ci
[ci-url]: https://github.com/expressjs/body-parser/actions/workflows/ci.yml
[coveralls-image]: https://badgen.net/coveralls/c/github/expressjs/body-parser/master
[coveralls-url]: https://coveralls.io/r/expressjs/body-parser?branch=master
[node-version-image]: https://badgen.net/npm/node/body-parser
[node-version-url]: https://nodejs.org/en/download
[npm-downloads-image]: https://badgen.net/npm/dm/body-parser
[npm-url]: https://www.npmjs.com/package/express-audit-logger
[npm-version-image]: https://badgen.net/npm/v/express-audit-logger
[ossf-scorecard-badge]: https://api.scorecard.dev/projects/github.com/expressjs/body-parser/badge
[ossf-scorecard-visualizer]: https://ossf.github.io/scorecard-visualizer/#/projects/github.com/expressjs/body-parser