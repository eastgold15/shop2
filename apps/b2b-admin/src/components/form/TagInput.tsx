// apps/b2b-admin/src/components/form/TagInput.tsx
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Tag {
  id?: string;
  value: string;
}

interface TagInputProps {
  name: string;
  placeholder?: string;
  label?: string;
}

export function TagInput({ name, placeholder, label }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const { control, setValue } = useFormContext();

  const tags =
    (useWatch({
      control,
      name,
    }) as Tag[]) || [];

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // 检查重复
    if (tags.some((tag) => tag.value === trimmedValue)) {
      toast.error("选项已存在");
      return;
    }

    const newTag: Tag = {
      id: undefined, // 新标签没有ID
      value: trimmedValue,
    };

    const newTags = [...tags, newTag];
    setValue(name, newTags, { shouldValidate: true, shouldDirty: true });
    setInputValue("");
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setValue(name, newTags, { shouldValidate: true, shouldDirty: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel className="flex items-center justify-between font-bold text-slate-500 text-xs uppercase">
        <span>{label || "选项配置"}</span>
        <span className="font-normal text-slate-400">
          已添加 {tags.length} 个
        </span>
      </FormLabel>

      <div className="flex min-h-25 flex-wrap gap-2 rounded-md border bg-white p-3 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
        {/* 已存在的标签预览 */}
        {tags.map((tag, index) => (
          <div
            className="group flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 py-1 pr-1 pl-2 text-slate-700 text-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50"
            key={tag.id || index}
          >
            <span className="font-medium">{tag.value}</span>
            <button
              className="rounded-sm p-0.5 text-slate-400 hover:text-red-500"
              onClick={() => removeTag(index)}
              type="button"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {/* 实时输入框 */}
        <Input
          className="min-w-37.5 flex-1 bg-transparent text-sm outline-none"
          onBlur={() => {
            // 失焦时自动添加（如果输入了内容）
            if (inputValue.trim()) {
              addTag();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "输入选项按回车添加..."}
          value={inputValue}
        />
      </div>
      <p className="text-[11px] text-slate-500">
        💡 输入内容后按 **Enter** 确认。支持直接修改 `value` 保持 `id` 不变。
      </p>
      <FormMessage />
    </FormItem>
  );
}
