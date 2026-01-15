// components/field-config/placeholder-editor.tsx

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PlaceholderEditorProps {
  control: Control<any>;
  name: string;
  type: "text" | "number";
}

export function PlaceholderEditor({
  control,
  name,
  type,
}: PlaceholderEditorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold text-slate-500 text-xs uppercase">
            默认值 / 占位符
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={type === "number" ? "0" : "请输入默认内容..."}
              type={type === "number" ? "number" : "text"}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
