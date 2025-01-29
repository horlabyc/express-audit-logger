import { AuditLog, AuditStorageProvider } from "src/types";
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileStorageProvider implements AuditStorageProvider {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath
  }

  async save(log: AuditLog): Promise<void> {
    const logEntry = JSON.stringify(log) + '\n'
    try {
      fs.appendFile(this.filePath, logEntry)
    } catch (error) {
      console.error(`Log not saved to file: ${error}`)
    }
  }
}