import {
  type TemplateContract,
  templateKeyTable,
  templateTable,
  templateValueTable,

} from "@repo/contract";
import { asc, eq, inArray, like } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { type ServiceContext } from "../lib/type";

export class TemplateService {
  public async create(body: TemplateContract["Create"], ctx: ServiceContext) {
    const { name, masterCategoryId, siteCategoryId, fields } = body as any;

    return await ctx.db.transaction(async (tx) => {
      // 1. 创建属性模板
      const [templateRes] = await tx
        .insert(templateTable)
        .values({
          masterCategoryId,
          // 将 "root" 或空值转为 null
          siteCategoryId:
            siteCategoryId && siteCategoryId !== "root" ? siteCategoryId : null,
          name,
        })
        .returning();

      if (!templateRes) {
        throw new HttpError.BadRequest("创建属性模板失败");
      }

      const templateId = templateRes.id;

      // 2. 处理字段列表
      if (fields && fields.length > 0) {
        for (const field of fields) {
          const {
            inputType,
            isRequired,
            options,
            value,
            key,
            isSkuSpec,
          } = field;

          // 2.1 插入属性定义 (templateKeyTable)
          const [newAttribute] = await tx
            .insert(templateKeyTable)
            .values({
              templateId,
              key, // 这里的 key 是 UI 上的 Display Name
              inputType,
              isRequired: !!isRequired,
              isSkuSpec: !!isSkuSpec,
            })
            .returning({ id: templateKeyTable.id });

          // 2.2 根据类型解析 value/options
          let valuesToInsert: string[] = [];

          if (inputType === "select" || inputType === "multiselect") {
            // 优先使用 options 数组（前端传递的格式）
            if (options && Array.isArray(options) && options.length > 0) {
              valuesToInsert = options.filter(Boolean);
            } else if (value && typeof value === "string") {
              // 兼容旧格式：逗号分隔的字符串
              valuesToInsert = value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            }
          } else if (
            (inputType === "text" || inputType === "number") &&
            value
          ) {
            // 文本/数字类型，value 是 placeholder 或默认值
            valuesToInsert = [String(value).trim()];
          }

          // 2.3 批量插入属性选项/预设值 (templateValueTable)
          if (valuesToInsert.length > 0) {
            const valueData = valuesToInsert.map((v, index) => ({
              templateKeyId: newAttribute.id,
              value: v,
              sortOrder: index,
            }));
            await tx.insert(templateValueTable).values(valueData);
          }
        }
      }

      // 返回符合基类签名的数据结构
      return templateRes;
    });
  }

  public async list(
    query: TemplateContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;
    const rows = await ctx.db
      .select()
      .from(templateTable)
      .leftJoin(templateKeyTable, eq(templateTable.id, templateKeyTable.templateId))
      .where(search ? like(templateTable.name, `%${search}%`) : undefined);

    const templateMap = new Map();

    for (const row of rows) {
      const t = row.template;
      const key = row.template_key;

      if (!templateMap.has(t.id)) {
        templateMap.set(t.id, {
          id: t.id,
          name: t.name,
          masterCategoryId: t.masterCategoryId,
          siteCategoryId: t.siteCategoryId,
          fields: [],
        });
      }

      if (key) {
        templateMap.get(t.id).fields.push({
          id: key.id,
          key: key.key, // 前端使用 key
          inputType: key.inputType, // 前端使用 inputType
          isRequired: key.isRequired, // 前端使用 isRequired
          isSkuSpec: key.isSkuSpec,
          // 这里我们统一定义一个 value 字段
          value: "",
          options: [],
        });
      }
    }

    const allFieldIds = Array.from(templateMap.values()).flatMap((t) =>
      t.fields.map((f: any) => f.id)
    );

    if (allFieldIds.length > 0) {
      const allValues = await ctx.db
        .select()
        .from(templateValueTable)
        .where(inArray(templateValueTable.id, allFieldIds))
        .orderBy(asc(templateValueTable.sortOrder));

      const valuesByAttributeId = new Map<string, string[]>();
      for (const val of allValues) {
        if (!valuesByAttributeId.has(val.id)) {
          valuesByAttributeId.set(val.id, []);
        }
        valuesByAttributeId.get(val.id)!.push(val.value);
      }

      for (const template of templateMap.values()) {
        for (const field of template.fields) {
          const rawValues = valuesByAttributeId.get(field.id) || [];

          // --- 核心逻辑：根据类型决定 value 的格式 ---
          if (
            field.inputType === "select" ||
            field.inputType === "multiselect"
          ) {
            // 对于选择框，value 应该是逗号分隔的字符串，方便前端编辑器的 textarea 显示
            field.value = rawValues.join(", ");
            // 同时保留 options 数组，方便前端渲染下拉列表预览
            field.options = rawValues;
          } else {
            // 对于 text 或 number，value 就是那唯一的一个提示/默认值字符串
            field.value = rawValues[0] || "";
            field.options = [];
          }
        }
      }
    }

    return Array.from(templateMap.values());
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: TemplateContract["Update"],
    ctx: ServiceContext
  ) {
    const { name, masterCategoryId, siteCategoryId, fields } = body as any;

    return await ctx.db.transaction(async (tx) => {
      // a. 更新基础信息
      await tx
        .update(templateTable)
        .set({
          name,
          masterCategoryId,
          // 将 "root" 或空值转为 null
          siteCategoryId:
            siteCategoryId && siteCategoryId !== "root" ? siteCategoryId : null,

        })
        .where(eq(templateTable.id, id));

      // b. 清理旧的关联数据 (复用抽离的方法)
      await this.clearTemplateRelations(id, tx);

      // c. 插入新数据
      if (fields && fields.length > 0) {
        for (const field of fields) {
          const {
            inputType,
            isRequired,
            options,
            value,

            key,
            isSkuSpec,
          } = field;

          // 2.1 插入属性定义 (templateKeyTable)
          const [newAttribute] = await tx
            .insert(templateKeyTable)
            .values({
              templateId: id,
              key, // 这里的 key 是 UI 上的 Display Name

              inputType,
              isRequired: !!isRequired,
              isSkuSpec: !!isSkuSpec,
            })
            .returning({ id: templateKeyTable.id });

          // 2.2 根据类型解析 value/options
          let valuesToInsert: string[] = [];

          if (inputType === "select" || inputType === "multiselect") {
            // 优先使用 options 数组（前端传递的格式）
            if (options && Array.isArray(options) && options.length > 0) {
              valuesToInsert = options.filter(Boolean);
            } else if (value && typeof value === "string") {
              // 兼容旧格式：逗号分隔的字符串
              valuesToInsert = value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            }
          } else if (
            (inputType === "text" || inputType === "number") &&
            value
          ) {
            // 文本/数字类型，value 是 placeholder 或默认值
            valuesToInsert = [String(value).trim()];
          }

          // 2.3 批量插入属性选项/预设值 (templateValueTable)
          if (valuesToInsert.length > 0) {
            const valueData = valuesToInsert.map((v, index) => ({
              templateKeyId: newAttribute.id,
              value: v,
              sortOrder: index,
            }));
            await tx.insert(templateValueTable).values(valueData);
          }
        }
      }
      const [res] = await tx
        .select()
        .from(templateTable)
        .where(eq(templateTable.id, id))
        .limit(1);
      return res;
    });
  }

  public async delete(id: string, ctx: ServiceContext) {
    return await ctx.db.transaction(async (tx) => {
      // 先清理关联数据
      await this.clearTemplateRelations(id, tx);

      // 再删除模板主体
      const [res] = await tx
        .delete(templateTable)
        .where(eq(templateTable.id, id))
        .returning();

      return res;
    });
  }

  /**
   * 内部清理方法：删除模板关联的所有属性和属性值
   * 抽离出来供 delete 和 update 复用
   */
  private async clearTemplateRelations(templateId: string, tx: any) {
    // 找到该模板下的所有属性 ID
    const oldAttributes = await tx
      .select({ id: templateKeyTable.id })
      .from(templateKeyTable)
      .where(eq(templateKeyTable.templateId, templateId));

    const oldAttributeIds = oldAttributes.map((a: any) => a.id);

    if (oldAttributeIds.length > 0) {
      // a. 删除关联的所有属性值 (ValueTable)
      await tx
        .delete(templateValueTable)
        .where(inArray(templateValueTable.templateKeyId, oldAttributeIds));

      // b. 删除所有属性定义 (templateKeyTable)
      await tx
        .delete(templateKeyTable)
        .where(eq(templateKeyTable.templateId, templateId));
    }
  }
}
