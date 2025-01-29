import { AuditLog, AuditStorageProvider } from "src/types";

export class ConsoleStorageProvider implements AuditStorageProvider {
  async save(log: AuditLog): Promise<void> {
    console.log(JSON.stringify(log));
  }

}