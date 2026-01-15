import { siteTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { db } from "./connection";

export const SiteSWithManageAble = async (tenantId: string) => {
  const allSites = await db
    .select({ id: siteTable.id })
    .from(siteTable)
    .where(eq(siteTable.tenantId, tenantId!)); // 只要是同租户的站点，集团都能管

  return allSites.map((s) => s.id);
};
