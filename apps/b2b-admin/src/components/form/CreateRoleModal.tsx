"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateRole } from "@/hooks/api/role";

// 1. 优化 Schema
// 使用 z.coerce.number() 可以自动将 input type="number" 的字符串转换为数字
const formSchema = z.object({
  name: z.string().min(2, "角色名称至少需要2个字符"),
  description: z.string().optional(),
  type: z.enum(["system", "custom"], {
    error: "请选择角色类型",
  }),
  priority: z.coerce // <--- 关键修改：coerce
    .number()
    .min(0, "优先级最小为 0")
    .max(100, "优先级最大为 100")
    .default(0),
});
// 2. 直接从 schema 推导类型，不要手动写 & 交叉类型
type FormData = z.infer<typeof formSchema>;

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRoleModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateRoleModalProps) {
  const createRole = useCreateRole();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "custom",
      priority: 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: FormData) => {
    try {
      await createRole.mutateAsync(data);
      toast.success("角色创建成功");
      onSuccess?.();
      handleOpenChange(false);
    } catch (error) {
      console.error("创建角色失败:", error);
      toast.error("角色创建失败");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset(); // 关闭时重置表单
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            创建新角色
          </DialogTitle>
          <DialogDescription>
            创建系统角色或自定义角色，配置权限和优先级
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色名称</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：仓库管理员" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色描述</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="描述该角色的职责和权限范围"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色类型</FormLabel>
                    {/* 3. Select 组件必须绑定 onValueChange 和 value */}
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value} // 关键：确保受控
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="custom">自定义角色</SelectItem>
                        <SelectItem value="system">系统角色</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>优先级 (0-100)</FormLabel>
                    <FormControl>
                      <Input
                        max={100}
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0"
                        type="number"
                        value={(field.value as any) ?? 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                disabled={createRole.isPending}
                onClick={() => handleOpenChange(false)}
                type="button"
                variant="outline"
              >
                取消
              </Button>
              <Button disabled={createRole.isPending} type="submit">
                {createRole.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  "创建角色"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
