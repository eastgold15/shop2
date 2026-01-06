"use client";

import { ShieldAlert, UserPlus } from "lucide-react";
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
import { useCreateUser } from "@/hooks/api";
import { HasFactory, HasGroup } from "../auth/Has";

const formSchema = z
  .object({
    name: z.string().min(1, "请输入姓名"),
    email: z.email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少需要6个字符"),
    confirmPassword: z.string(),
    phone: z.string(),
    whatsapp: z.string().optional(),
    position: z.string().optional(),
    deptId: z.string(),
    roleId: z.string(),
    isActive: z.boolean().default(true),
    masterCategoryIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateUserModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserModalProps) {
  const createUser = useCreateUser();

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await createUser.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        isActive: true,
        phone: data.phone,
        deptId: data.deptId,
        roleId: data.roleId,
        whatsapp: data.whatsapp,
        position: data.position,
        masterCategoryIds: data.masterCategoryIds || [],
      });

      toast.success("用户创建成功");
      form.reset();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            创建用户
          </DialogTitle>
          <DialogDescription>
            创建新的系统用户账号。只有超级管理员可以执行此操作。
          </DialogDescription>
        </DialogHeader>

        <HasGroup>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        type="email"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码 *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="至少6个字符"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>确认密码 *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="再次输入密码"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电话</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入手机号码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  disabled={createUser.isPending}
                  onClick={() => onOpenChange(false)}
                  type="button"
                  variant="outline"
                >
                  取消
                </Button>
                <Button disabled={createUser.isPending} type="submit">
                  {createUser.isPending ? "创建中..." : "创建用户"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </HasGroup>

        <HasFactory>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShieldAlert className="mb-4 h-12 w-12 text-amber-500" />
            <p className="text-slate-600 text-sm">
              您没有权限创建用户。此功能超级管理员使用。
            </p>
          </div>
        </HasFactory>
      </DialogContent>
    </Dialog>
  );
}
