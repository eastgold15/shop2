import type { db } from "~/db/connection";

export interface ServiceContext {
  db: typeof db;
  auth: {
    userId: string;
    siteId: string;
    tenantId: string;
    factoryId?: string | null; // 👈 工厂特定 ID
    exporterId?: string | null; // 👈 出口商特定 ID
    role: string;
  };
}
