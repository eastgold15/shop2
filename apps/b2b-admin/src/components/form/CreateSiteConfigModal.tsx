"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SiteConfigContract } from "@repo/contract";
import { Loader2 } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SiteSelect } from "@/components/ui/site-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateSiteConfig,
  useUpdateSiteConfig,
} from "@/hooks/api/site-config";

const formSchema = z.object({
  key: z.string().min(1, "配置键不能为空"),
  value: z.string().min(1, "配置值不能为空"),
  description: z.string().optional(),
  category: z.string().default("general"),
  url: z.string().optional(),
  translatable: z.boolean().default(true),
  visible: z.boolean().default(false),
  siteId: z.string().min(1, "请选择站点"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateSiteConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editingConfig?: SiteConfigContract["Response"];
}

export function CreateSiteConfigModal({
  open,
  onOpenChange,
  onSuccess,
  editingConfig,
}: CreateSiteConfigModalProps) {
  const createSiteConfig = useCreateSiteConfig();
  const updateSiteConfig = useUpdateSiteConfig();

  const isEdit = !!editingConfig;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "1",
      value: "1",
      description: "1",
      category: "general",
      url: "1",
      translatable: true,
      visible: false,
      siteId: "1",
    },
  });

  // 当编辑的配置变化时，重置表单
  useEffect(() => {
    if (editingConfig) {
      form.reset({
        key: editingConfig.key,
        value: editingConfig.value,
        description: editingConfig.description || "",
        category: editingConfig.category || "general",
        url: editingConfig.url || "",
        translatable: editingConfig.translatable ?? true,
        visible: editingConfig.visible ?? false,
        siteId: editingConfig.siteId,
      });
    } else {
      form.reset({
        key: "",
        value: "",
        description: "",
        category: "general",
        url: "",
        translatable: true,
        visible: false,
        siteId: "",
      });
    }
  }, [editingConfig, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        ...data,
        description: data.description || null,
        category: data.category || "general",
        url: data.url || null,
      };

      if (isEdit && editingConfig) {
        await updateSiteConfig.mutateAsync({
          id: editingConfig.id,
          data: submitData,
        });
      } else {
        await createSiteConfig.mutateAsync(submitData);
      }
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

  const isLoading = createSiteConfig.isPending || updateSiteConfig.isPending;

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑站点配置" : "创建站点配置"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "修改站点配置信息"
              : "为站点添加新的配置项，支持多语言和可见性控制"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="siteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属站点 *</FormLabel>
                  <FormControl>
                    <SiteSelect
                      disabled={isEdit}
                      onChange={field.onChange}
                      placeholder="请选择站点"
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>选择此配置项所属的站点</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配置键 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例如: company.name, contact.email"
                      {...field}
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormDescription>
                    配置项的唯一标识符，建议使用点号分隔的命名格式
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配置值 *</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[80px]"
                      placeholder="请输入配置值"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    配置项的实际值，支持文本、JSON 等格式
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input placeholder="配置项的说明" {...field} />
                  </FormControl>
                  <FormDescription>简要描述此配置项的用途</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例如: general, seo, contact"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    配置项的分类，便于管理和分组
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>关联 URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>可选的关联链接地址</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="translatable"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>可翻译</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>是否支持多语言翻译</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>前端可见</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>是否在前端展示</FormDescription>
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
                    {isEdit ? "保存中..." : "创建中..."}
                  </>
                ) : isEdit ? (
                  "保存修改"
                ) : (
                  "创建配置"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
