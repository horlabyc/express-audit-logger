import express from 'express'
import { AuditLogger } from './audit-logger';
import bodyParser from 'body-parser';
import { ConsoleStorageProvider } from './providers/console-provider';
import { FileStorageProvider } from './providers/file-provider';

const app = express();
const consoleLogger = new AuditLogger({
  storageProvider: new ConsoleStorageProvider(),
  maskSensitiveData: true,
  sensitiveFields: ['password', 'token'],
  excludePaths: ['/health', '/metrics']
})

const fileLogger = new AuditLogger({
  storageProvider: new FileStorageProvider('./audit-logs.txt'),
  maskSensitiveData: true,
  sensitiveFields: ['password', 'token'],
})

app.use(consoleLogger.middleware());

app.use(fileLogger.middleware());

app.use(bodyParser.json())

app.post("/login", async (req, res) => {
  await consoleLogger.log('CREATE_USER', {
    userId: 123,
    email: 'user@example.com'
  });
  res.send({ success: true });
})

app.listen(3000, () => console.log("Server running on port 3000"))