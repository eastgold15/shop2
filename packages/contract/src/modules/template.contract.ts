import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { templateTable } from "../table.schema";
import { TemplateKeyInsertFields } from "./template-key.contract";
import { TemplateValueInsertFields } from "./template-value.contract";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TemplateInsertFields = spread(templateTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TemplateFields = spread(templateTable, "select");
export const TemplateContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...TemplateFields,
  }),
  // 创建请求 (默认排除系统字段)
  Create: t.Object({
    fields: t.Optional(
      t.Array(
        t.Object({
          key: TemplateKeyInsertFields.key,
          inputType: TemplateKeyInsertFields.inputType,
          isRequired: TemplateKeyInsertFields.isRequired,
          isSkuSpec: TemplateKeyInsertFields.isSkuSpec,
          value: TemplateValueInsertFields.value, // 可选：text/number 类型使用
          options: t.Optional(t.Array(t.String())), // 可选：select/multiselect 类型使用
        })
      )
    ),
    name: TemplateInsertFields.name,
    masterCategoryId: TemplateInsertFields.masterCategoryId,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      fields: t.Optional(
        t.Array(
          t.Object({
            key: TemplateKeyInsertFields.key,
            inputType: TemplateKeyInsertFields.inputType,
            isRequired: TemplateKeyInsertFields.isRequired,
            isSkuSpec: TemplateKeyInsertFields.isSkuSpec,
            value: TemplateValueInsertFields.value, // 可选：text/number 类型使用
            options: t.Optional(
              t.Array(
                t.Object({ id: t.Optional(t.String()), value: t.String() })
              )
            ), // 可选：select/multiselect 类型使用
          })
        )
      ),
      name: TemplateInsertFields.name,
      masterCategoryId: TemplateInsertFields.masterCategoryId,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(TemplateInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...TemplateFields })),
    total: t.Number(),
  }),
} as const;

export type TemplateContract = InferDTO<typeof TemplateContract>;
