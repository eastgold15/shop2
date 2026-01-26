// components/field-config/options-editor.tsx

import { TagInput } from "@/components/form/TagInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface OptionsEditorProps {
  name: string; // 例如: `fields.${index}.options`
}

export function OptionsEditor({ name }: OptionsEditorProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold text-slate-500 text-xs uppercase">
            选项配置 (每行一个)
          </FormLabel>
          <FormControl>
            <TagInput
              label="选项配置"
              name={name}
              placeholder="输入选项按回车添加..."
            />
          </FormControl>
          <p className="text-[10px] text-slate-400">
            * 也就是用户下拉时能看到的内容
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
