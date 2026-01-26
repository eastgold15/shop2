// components/template-field-row.tsx

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { OptionsEditor } from "./OptionsEditor";
import { PlaceholderEditor } from "./PlaceholderEditor";
import { FieldType } from "./type";

// 引入上面封装的组件

interface TemplateFieldRowProps {
  control: Control<any>;
  index: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function TemplateFieldRow({
  control,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: TemplateFieldRowProps) {
  // 关键：实时监听当前行的输入类型
  const inputType = useWatch({
    control,
    name: `fields.${index}.inputType`,
  }) as FieldType;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md",
        "fade-in slide-in-from-bottom-2 animate-in duration-300"
      )}
    >
      {/* 顶部：基本信息与操作栏 */}
      <div className="flex items-start justify-between gap-4">
        {/* 1. 字段名称 */}
        <div className="flex-2">
          <FormField
            control={control}
            name={`fields.${index}.key`}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="font-bold text-slate-500 text-xs uppercase">
                  字段名称
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-9 font-medium"
                    placeholder="例如：颜色、尺寸"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* 2. 类型选择 */}
        <div className="flex-[1.5]">
          <FormField
            control={control}
            name={`fields.${index}.inputType`}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="font-bold text-slate-500 text-xs uppercase">
                  输入类型
                </FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    // 💡 这里可以扩展：切换类型时清空 value 或 options
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">📄 文本输入</SelectItem>
                    <SelectItem value="number">🔢 数字输入</SelectItem>
                    <SelectItem value="select">🔽 下拉单选</SelectItem>
                    <SelectItem value="multiselect">✅ 下拉多选</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* 3. 操作按钮 */}
        <div className="mt-7 flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <Button
            className="h-8 w-8 text-slate-400 hover:text-indigo-600"
            disabled={isFirst}
            onClick={onMoveUp}
            size="icon"
            variant="ghost"
          >
            <ArrowUp size={16} />
          </Button>
          <Button
            className="h-8 w-8 text-slate-400 hover:text-indigo-600"
            disabled={isLast}
            onClick={onMoveDown}
            size="icon"
            variant="ghost"
          >
            <ArrowDown size={16} />
          </Button>
          <Button
            className="h-8 w-8 text-slate-400 hover:text-red-500"
            onClick={onRemove}
            size="icon"
            variant="ghost"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* 底部：动态配置区域 (根据类型渲染) */}
      <div className="relative rounded-md bg-slate-50 p-3">
        {/* 装饰性小箭头 */}
        <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 bg-slate-50" />

        {inputType === "select" || inputType === "multiselect" ? (
          // 场景 A: 下拉选择 -> 渲染 OptionsEditor
          <OptionsEditor name={`fields.${index}.options`} />
        ) : (
          // 场景 B: 文本/数字 -> 渲染 PlaceholderEditor
          <PlaceholderEditor
            control={control}
            name={`fields.${index}.value`}
            type={inputType === "number" ? "number" : "text"}
          />
        )}
      </div>

      {/* 底部开关 */}
      <div className="flex items-center gap-6 px-1">
        <FormField
          control={control}
          name={`fields.${index}.isRequired`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <input
                  checked={field.value}
                  className="accent-indigo-600"
                  onChange={field.onChange}
                  type="checkbox"
                />
              </FormControl>
              <FormLabel className="text-slate-600 text-xs">设为必填</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`fields.${index}.isSkuSpec`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <input
                  checked={field.value}
                  className="accent-indigo-600"
                  onChange={field.onChange}
                  type="checkbox"
                />
              </FormControl>
              <FormLabel className="font-medium text-indigo-600 text-xs">
                作为 SKU 规格
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
