/**
 * 数据迁移脚本：将商品级媒体迁移到变体媒体
 *
 * 功能：
 * - 将 productMedia 表中的数据迁移到 productVariantMedia 表
 * - 自动识别商品模板中的颜色属性
 * - 将商品级媒体分配给第一个颜色值
 *
 * 使用方法：
 * bun run migrate-variant-media.ts
 */

import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  productMediaTable,
  productTemplateTable,
  productVariantMediaTable,
  templateKeyTable,
  templateValueTable,
} from "../src/table.schema";

async function migrateProductMediaToVariant() {
  const db = drizzle("postgresql://postgres:postgres@localhost:5432/shop");

  console.log("======================================");
  console.log("开始迁移商品媒体到变体媒体...");
  console.log("======================================\n");

  try {
    // 1. 获取所有有媒体的商品
    const productsWithMedia = await db
      .selectDistinct({
        productId: productMediaTable.productId,
      })
      .from(productMediaTable);

    console.log(`找到 ${productsWithMedia.length} 个有媒体的商品\n`);

    let successCount = 0;
    let skippedCount = 0;

    for (const { productId } of productsWithMedia) {
      try {
        console.log("--------------------------------------");
        console.log(`处理商品: ${productId}`);

        // 2. 获取商品模板
        const [productTemplate] = await db
          .select()
          .from(productTemplateTable)
          .where(eq(productTemplateTable.productId, productId));

        if (!productTemplate) {
          console.log("  ⚠️  商品无模板，跳过");
          skippedCount++;
          continue;
        }

        // 3. 查找颜色属性
        const keys = await db
          .select()
          .from(templateKeyTable)
          .where(
            and(
              eq(templateKeyTable.templateId, productTemplate.templateId),
              eq(templateKeyTable.isSkuSpec, true)
            )
          );

        const colorKey = keys.find((k) => /color|颜色|colour/i.test(k.key));
        if (!colorKey) {
          console.log("  ⚠️  商品模板无颜色属性，跳过");
          skippedCount++;
          continue;
        }

        console.log(`  ✓ 找到颜色属性: ${colorKey.key}`);

        // 4. 获取颜色属性的所有值
        const values = await db
          .select()
          .from(templateValueTable)
          .where(eq(templateValueTable.templateKeyId, colorKey.id))
          .orderBy(asc(templateValueTable.sortOrder));

        if (values.length === 0) {
          console.log("  ⚠️  颜色属性无可选值，跳过");
          skippedCount++;
          continue;
        }

        console.log(
          `  ✓ 找到 ${values.length} 个颜色值: ${values.map((v) => v.value).join(", ")}`
        );

        // 5. 获取商品的所有媒体
        const media = await db
          .select()
          .from(productMediaTable)
          .where(eq(productMediaTable.productId, productId))
          .orderBy(asc(productMediaTable.sortOrder));

        if (media.length === 0) {
          console.log("  ⚠️  商品无媒体数据，跳过");
          skippedCount++;
          continue;
        }

        console.log(`  ✓ 找到 ${media.length} 条媒体记录`);

        // 6. 检查是否已经迁移过
        const existingVariantMedia = await db
          .select()
          .from(productVariantMediaTable)
          .where(eq(productVariantMediaTable.productId, productId));

        if (existingVariantMedia.length > 0) {
          console.log("  ℹ️  商品已迁移过，跳过");
          skippedCount++;
          continue;
        }

        // 7. 将商品级媒体分配给第一个颜色值
        const firstColorValue = values[0];
        console.log(`  → 迁移到颜色: ${firstColorValue.value}`);

        const variantMediaRelations = media.map((m) => ({
          productId,
          attributeValueId: firstColorValue.id,
          mediaId: m.mediaId,
          isMain: m.isMain,
          sortOrder: m.sortOrder,
        }));

        await db.insert(productVariantMediaTable).values(variantMediaRelations);

        console.log(`  ✓ 成功迁移 ${media.length} 条媒体记录`);
        successCount++;
      } catch (error) {
        console.error("  ❌ 迁移失败:", error);
      }
    }

    console.log("\n======================================");
    console.log("迁移完成！");
    console.log(`成功: ${successCount} 个商品`);
    console.log(`跳过: ${skippedCount} 个商品`);
    console.log(`总计: ${productsWithMedia.length} 个商品`);
    console.log("======================================");
  } catch (error) {
    console.error("迁移过程出错:", error);
    throw error;
  } finally {
    console.log("11")
  }
}

migrateProductMediaToVariant().catch((error) => {
  console.error("脚本执行失败:", error);
  process.exit(1);
});
