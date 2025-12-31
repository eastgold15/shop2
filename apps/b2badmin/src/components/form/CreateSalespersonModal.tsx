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
import { Switch } from "@/components/ui/switch";
import { useMasterCategories } from "@/hooks/api/mastercategory";
import { useCreateSalesperson } from "@/hooks/api/salesperson";
import { useAuthStore } from "@/stores/auth-store";

const formSchema = z.object({
  // 用户信息
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
  name: z.string().min(1, "姓名不能为空"),
  // 业务员信息
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  avatar: z.string().optional(),
  // 主分类
  masterCategoryIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateSalespersonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateSalespersonModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateSalespersonModalProps) {
  const createSalesperson = useCreateSalesperson();
  const { data: masterCategoriesResponse } = useMasterCategories({
    page: 1,
    limit: 100,
  });
  const masterCategories = masterCategoriesResponse || [];
  const currentSite = useAuthStore((state) => state.currentSite);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      whatsapp: "",
      position: "",
      department: "",
      avatar: "",
      masterCategoryIds: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createSalesperson.mutateAsync(data);
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

  const isLoading = createSalesperson.isPending;

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-175">
        <DialogHeader>
          <DialogTitle>创建业务员</DialogTitle>
          <DialogDescription>
            创建新的业务员账号，设置归属关系和负责的主分类
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 用户账号信息 */}
            <div className="space-y-4">
              <div className="border-slate-200 border-b pb-2">
                <h3 className="font-semibold text-slate-900">账号信息</h3>
                <p className="text-slate-500 text-sm">
                  设置业务员的登录账号和密码
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
                        placeholder="至少6个字符"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 业务员信息 */}
            <div className="space-y-4">
              <div className="border-slate-200 border-b pb-2">
                <h3 className="font-semibold text-slate-900">业务员信息</h3>
                <p className="text-slate-500 text-sm">
                  设置业务员的联系方式和职位信息
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

              <div className="grid grid-cols-2 gap-4">
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

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>部门</FormLabel>
                      <FormControl>
                        <Input placeholder="销售部" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>头像 URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 当前归属信息展示 */}
            {currentSite && (
              <div className="rounded-md bg-blue-50 p-3">
                <p className="font-medium text-blue-900 text-sm">
                  归属信息：
                  {currentSite.siteType === "exporter" ? " 出口商" : " 工厂"}
                </p>
                <p className="text-blue-700 text-xs">
                  业务员将自动归属到当前登录用户的站点
                </p>
              </div>
            )}

            {/* 主分类分配 */}
            <div className="space-y-4">
              <div className="border-slate-200 border-b pb-2">
                <h3 className="font-semibold text-slate-900">主分类分配</h3>
                <p className="text-slate-500 text-sm">
                  选择该业务员负责的主分类（可多选）
                </p>
              </div>

              <FormField
                control={form.control}
                name="masterCategoryIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2 block">
                      <Label>负责的主分类</Label>
                    </div>
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                      {masterCategories.length === 0 ? (
                        <p className="text-slate-500 text-sm">暂无主分类</p>
                      ) : (
                        masterCategories.map((category) => (
                          <div
                            className="flex items-center space-x-2"
                            key={category.id}
                          >
                            <Switch
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), category.id]
                                  : (field.value || []).filter(
                                      (id) => id !== category.id
                                    );
                                field.onChange(newValue);
                              }}
                            />
                            <label className="text-slate-700 text-sm">
                              {category.name}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  "创建业务员"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
