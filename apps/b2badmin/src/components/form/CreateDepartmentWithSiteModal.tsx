"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Server, User } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { useCreateDepartmentWithSiteAndAdmin } from "@/hooks/api/department";

// 表单验证模式
const formSchema = z.object({
  // 部门信息
  departmentName: z.string().min(2, "部门名称至少需要2个字符"),
  departmentCode: z.string().min(2, "部门编码至少需要2个字符"),
  category: z.enum(["group", "factory"]),
  address: z.string().optional(),
  contactPhone: z.string().optional(),

  // 站点信息
  siteName: z.string().min(2, "站点名称至少需要2个字符"),
  domain: z.string().min(2, "站点域名至少需要2个字符"),

  // 管理员信息
  adminName: z.string().min(2, "管理员姓名至少需要2个字符"),
  adminEmail: z.string().email("请输入有效的邮箱地址"),
  adminPassword: z.string().min(6, "密码至少需要6个字符"),
  adminPhone: z.string().optional(),
  adminPosition: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateDepartmentWithSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateDepartmentWithSiteModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateDepartmentWithSiteModalProps) {
  const createDepartment = useCreateDepartmentWithSiteAndAdmin();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentName: "",
      departmentCode: "",
      category: "factory",
      address: "",
      contactPhone: "",
      siteName: "",
      domain: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      adminPhone: "",
      adminPosition: "部门管理员",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createDepartment.mutateAsync({
        department: {
          name: data.departmentName,
          code: data.departmentCode,
          category: data.category,
          address: data.address,
          contactPhone: data.contactPhone,
        },
        site: {
          name: data.siteName,
          domain: data.domain,
          isActive: true,
        },
        admin: {
          name: data.adminName,
          email: data.adminEmail,
          password: data.adminPassword,
          phone: data.adminPhone,
          position: data.adminPosition,
        },
      });
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-175">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            创建新部门
          </DialogTitle>
          <DialogDescription>
            一次性创建部门、关联站点和管理员账号
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 部门信息 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Building2 className="h-4 w-4 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">部门信息</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>部门名称 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：东莞制造工厂" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>部门编码 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：DG001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>部门类型 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择部门类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="group">集团</SelectItem>
                        <SelectItem value="factory">工厂</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>详细地址</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="广东省深圳市南山区科技园"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系电话</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：0755-88888888" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 站点信息 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Server className="h-4 w-4 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">站点信息</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>站点名称 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：东莞工厂站" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>站点域名 *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="dg-factory.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 管理员信息 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User className="h-4 w-4 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">管理员信息</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>管理员姓名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：张三" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱地址 *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          type="email"
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
                name="adminPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>登录密码 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入至少6位密码"
                        type="password"
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
                  name="adminPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>手机号码</FormLabel>
                      <FormControl>
                        <Input placeholder="13800000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>职位</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：部门经理" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={createDepartment.isPending}
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                取消
              </Button>
              <Button disabled={createDepartment.isPending} type="submit">
                {createDepartment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    创建部门
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
