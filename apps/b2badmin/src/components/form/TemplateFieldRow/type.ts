// types.ts
import { z } from "zod";

export const FieldTypeSchema = z.enum(["text", "number", "select", "multiselect"]);

export const TemplateFieldSchema = z.object({
  id: z.string(),
  key: z.string().min(1, "名称必填"),
  inputType: FieldTypeSchema,
  // text/number 用 value 存占位符
  value: z.string(),
  // select 用 options 存选项数组
  options: z.array(z.string()).optional(),
  isRequired: z.boolean().default(false),
  isSkuSpec: z.boolean().default(false),
});

export type FieldType = z.infer<typeof FieldTypeSchema>;