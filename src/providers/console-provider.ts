import { AuditLog, AuditStorageProvider } from "../types";

export class ConsoleStorageProvider implements AuditStorageProvider {
  async save(log: AuditLog): Promise<void> {
    console.log(JSON.stringify(log));
  }

}