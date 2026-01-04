"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMasterCategoryList } from "@/hooks/api";
import { useDepartmentList } from "@/hooks/api/department";
import { useRoleList } from "@/hooks/api/role";
import { useCreateUser } from "@/hooks/api/user";

const formSchema = z.object({
  // 用户信息
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
  phone: z.string(),
  whatsapp: z.string(),
  position: z.string(),
  // 角色和部门
  roleId: z.string().min(1, "请选择角色"),
  deptId: z.string().min(1, "请选择部门"),
  isActive: z.boolean().default(true),
  // 主分类（如果是业务员）
  masterCategoryIds: z.array(z.string()).optional(),
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
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useRoleList();
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useDepartmentList({});
  const { data: masterCategoriesData, isLoading: categoriesLoading } =
    useMasterCategoryList();

  // 调试：在控制台输出数据
  console.log("Roles Data:", rolesData);
  console.log("Departments Data:", departmentsData);
  console.log("MasterCategories Data:", masterCategoriesData);

  const roles = rolesData?.data || rolesData || [];
  const departments = departmentsData?.data || departmentsData || [];
  const masterCategories = masterCategoriesData || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      whatsapp: "",
      position: "",
      roleId: "",
      deptId: "",
      isActive: true,
      masterCategoryIds: [],
    },
  });

  // 监听角色变化，如果是业务员角色才显示主分类选择
  const selectedRole = form.watch("roleId");
  const isSalesperson =
    roles.find((r: any) => r.id === selectedRole)?.name === "salesperson";

  const onSubmit = async (data: FormData) => {
    try {
      await createUser.mutateAsync(data);
      onSuccess?.();
      form.reset();
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

  const isLoading = createUser.isPending;

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>创建用户</DialogTitle>
          <DialogDescription>
            创建新用户并分配角色和部门。如果是业务员角色，可以分配负责的主分类。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 账号信息 */}
            <div className="space-y-4">
              <div className="border-slate-200 border-b pb-2">
                <h3 className="font-semibold text-slate-900">账号信息</h3>
                <p className="text-slate-500 text-sm">
                  设置用户的登录账号和密码
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入姓名" {...field} />
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
                        <Input placeholder="example@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入密码（至少6个字符）"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 联系方式 */}
            <div className="space-y-4">
              <div className="border-slate-200 border-b pb-2">
                <h3 className="font-semibold text-slate-900">联系方式</h3>
                <p className="text-slate-500 text-sm">
                  设置用户的联系方式（可选）
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>手机号码</FormLabel>
                      <FormControl>
                        <Input placeholder="+86 138 0000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="+86 138 0000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职位</FormLabel>
                    <FormControl>
                      <Input placeholder="销售经理" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 角色和部门 */}
            <div className="space-y-4">
              <div className="border-slate-200 border-b pb-2">
                <h3 className="font-semibold text-slate-900">角色和部门</h3>
                <p className="text-slate-500 text-sm">
                  分配用户的角色和所属部门
                </p>
              </div>

              {/* 调试信息 */}
              {(rolesError || departmentsError) && (
                <div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">
                  <p>加载数据失败：</p>
                  {rolesError && <p>角色: {rolesError.message}</p>}
                  {departmentsError && <p>部门: {departmentsError.message}</p>}
                </div>
              )}

              <div className="rounded-md bg-slate-50 p-3 text-slate-700 text-sm">
                <p>调试信息：</p>
                <p>角色数量: {roles.length}</p>
                <p>部门数量: {departments.length}</p>
                <p>主分类数量: {masterCategories.length}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>角色 *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择角色" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role: any) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deptId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>部门 *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择部门" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept: any) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>账号状态</FormLabel>
                      <p className="text-slate-500 text-xs">
                        启用后用户可以登录系统
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* 主分类分配（仅业务员） */}
            {isSalesperson && (
              <div className="space-y-4">
                <div className="border-slate-200 border-b pb-2">
                  <h3 className="font-semibold text-slate-900">主分类分配</h3>
                  <p className="text-slate-500 text-sm">
                    选择该业务员负责的主分类（可多选）
                  </p>
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label>负责的主分类</Label>
                  </div>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                    {masterCategories.length === 0 ? (
                      <p className="text-slate-500 text-sm">暂无主分类</p>
                    ) : (
                      masterCategories.map((category: any) => {
                        const isSelected = form
                          .watch("masterCategoryIds")
                          ?.includes(category.id);
                        return (
                          <div
                            className="flex items-center space-x-2"
                            key={category.id}
                          >
                            <Switch
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const current =
                                  form.watch("masterCategoryIds") || [];
                                if (checked) {
                                  form.setValue("masterCategoryIds", [
                                    ...current,
                                    category.id,
                                  ]);
                                } else {
                                  form.setValue(
                                    "masterCategoryIds",
                                    current.filter((id) => id !== category.id)
                                  );
                                }
                              }}
                            />
                            <label className="text-slate-700 text-sm">
                              {category.name}
                            </label>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                取消
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  "创建用户"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
