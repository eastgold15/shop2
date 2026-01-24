"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Server, User } from "lucide-react";
import { useEffect } from "react";
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
import { useAuthStore } from "@/stores/auth-store";

const formSchema = z.object({
  id: z.string().optional(),
  // 部门信息
  departmentName: z.string().min(2, "部门名称至少需要2个字符"),
  departmentCode: z.string().min(2, "部门编码至少需要2个字符"),
  category: z.enum(["group", "factory"]),
  address: z.string().optional(),
  contactPhone: z.string().optional(),

  // 站点信息
  siteName: z.string().min(2, "站点名称至少需要2个字符"),
  domain: z.string().min(2, "站点域名至少需要2个字符"),

  // 管理员信息（编辑时可选）
  adminName: z.string().optional(),
  adminEmail: z.email("请输入有效的邮箱地址").optional(),
  adminPassword: z.string().min(6, "密码至少需要6个字符").optional(),
  adminPhone: z.string().optional(),
  adminPosition: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateDepartmentWithSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: EditDeptData;
}

export type EditDeptData = {
  department: any;
  site: any;
  admin?: any;
};

export function CreateDepartmentWithSiteModal({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
}: CreateDepartmentWithSiteModalProps) {
  const isEdit = mode === "edit";
  const createDepartment = useCreateDepartmentWithSiteAndAdmin();
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.isSuperAdmin;

  const isGroup = user?.context.department.category === "group";
  const isReadOnly = !(isSuperAdmin || isGroup) && isEdit;
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

  useEffect(() => {
    if (isEdit && initialData) {
      form.reset({
        id: initialData.department.id,
        departmentName: initialData.department.name || "",
        departmentCode: initialData.department.code || "",
        category: initialData.department.category || "factory",
        address: initialData.department.address || "",
        contactPhone: initialData.department.contactPhone || "",
        siteName: initialData.site.name || "",
        domain: initialData.site.domain || "",
        adminName: initialData.admin?.name || "",
        adminEmail: initialData.admin?.email || "",
        adminPassword: "",
        adminPhone: initialData.admin?.phone || "",
        adminPosition: initialData.admin?.position || "部门管理员",
      });
    } else if (!isEdit) {
      form.reset({
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
      });
    }
  }, [isEdit, initialData, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        department: {
          id: isEdit ? data.id : undefined,
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
        ...(isEdit
          ? {
              admin:
                data.adminName && data.adminEmail
                  ? {
                      name: data.adminName,
                      email: data.adminEmail,
                      ...(data.adminPassword && {
                        password: data.adminPassword,
                      }),
                      phone: data.adminPhone,
                      position: data.adminPosition,
                    }
                  : undefined,
            }
          : {
              admin: {
                name: data.adminName!,
                email: data.adminEmail!,
                password: data.adminPassword!,
                phone: data.adminPhone,
                position: data.adminPosition,
              },
            }),
      };

      await createDepartment.mutateAsync(payload as any);
      form.reset();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("操作失败:", error);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  const isLoading = createDepartment.isPending;

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            {isEdit ? "编辑部门" : "创建新部门"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "编辑部门信息、站点设置和管理员信息（管理员信息为可选）"
              : "一次性创建部门、关联站点和管理员账号"}
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
                <h3 className="font-semibold text-slate-900">
                  管理员信息{" "}
                  {isEdit && (
                    <span className="font-normal text-slate-500">(可选)</span>
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>管理员姓名 {!isEdit && "*"}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="例如：张三"
                          readOnly={isReadOnly}
                          style={
                            isReadOnly
                              ? {
                                  backgroundColor: "#f5f5f5",
                                  cursor: "not-allowed",
                                }
                              : {}
                          }
                          {...field}
                        />
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
                      <FormLabel>邮箱地址 {!isEdit && "*"}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          readOnly={isReadOnly}
                          style={
                            isReadOnly
                              ? {
                                  backgroundColor: "#f5f5f5",
                                  cursor: "not-allowed",
                                }
                              : {}
                          }
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
                disabled={isLoading}
                name="adminPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      登录密码 {!isEdit && "*"}{" "}
                      {isEdit && (
                        <span className="font-normal text-slate-500">
                          (留空不修改)
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          isEdit ? "留空则不修改密码" : "请输入至少6位密码"
                        }
                        readOnly={isReadOnly}
                        style={
                          isReadOnly
                            ? {
                                backgroundColor: "#f5f5f5",
                                cursor: "not-allowed",
                              }
                            : {}
                        }
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
                        <Input
                          placeholder="13800000000"
                          readOnly={isReadOnly}
                          style={
                            isReadOnly
                              ? {
                                  backgroundColor: "#f5f5f5",
                                  cursor: "not-allowed",
                                }
                              : {}
                          }
                          {...field}
                        />
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
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                取消
              </Button>
              <Button type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "更新中..." : "创建中..."}
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    {isEdit ? "保存修改" : "创建部门"}
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
