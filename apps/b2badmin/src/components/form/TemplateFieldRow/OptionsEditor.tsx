// components/field-config/options-editor.tsx

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface OptionsEditorProps {
  control: Control<any>;
  name: string; // 例如: `fields.${index}.options`
}

export function OptionsEditor({ control, name }: OptionsEditorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // 核心回显逻辑：将数组转为字符串显示
        const displayValue = Array.isArray(field.value)
          ? field.value.join("\n")
          : "";

        return (
          <FormItem>
            <FormLabel className="font-bold text-slate-500 text-xs uppercase">
              选项配置 (每行一个)
            </FormLabel>
            <FormControl>
              <Textarea
                className="min-h-25 font-mono text-sm"
                onBlur={() => {
                  const cleanArray = displayValue
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  field.onChange(cleanArray);
                }}
                // 1. 绑定处理后的显示值
                onChange={(e) => {
                  const text = e.target.value;
                  // 保留原始输入以便用户换行，但在 blur 或提交时通常已经是最新的
                  // 这里我们实时转换，但为了体验，可以在 onBlur 里做最终清洗
                  const array = text.split("\n");
                  field.onChange(array);
                }}
                // 2. 处理变更：字符串 -> 数组
                placeholder="例如：\n红色\n蓝色\n绿色"
                // 3. 失去焦点时自动清洗空行
                value={displayValue}
              />
            </FormControl>
            <p className="text-[10px] text-slate-400">
              * 也就是用户下拉时能看到的内容
            </p>
            <FormMessage />

            {/* 预览区域 (可选) */}
            {Array.isArray(field.value) && field.value.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {field.value.filter(Boolean).map((opt: string, i: number) => (
                  <span
                    className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 text-xs"
                    key={i}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
}
