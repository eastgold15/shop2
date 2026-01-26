"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HasFactory } from "@/components/auth/Has";
import { AttributeEditor } from "@/components/form/AttributeEditor";
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
import { MediaSelect } from "@/components/ui/media-select";
import { SiteCategoryTreeSelect } from "@/components/ui/site-category-tree-select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct, useUpdateProduct } from "@/hooks/api/product";
import { useTemplateList } from "@/hooks/api/template";

// 表单验证 schema - 创建时必填字段与契约一致
const formSchema = z.object({
  siteName: z.string().min(1, "商品名称不能为空"),
  siteDescription: z.string(),
  spuCode: z.string().min(1, "SPU编码不能为空"),
  status: z.number().optional(),
  templateId: z.string().min(1, "请选择属性模板"),
  seoTitle: z.string().optional(),
  siteCategoryId: z.string().min(1, "请选择站点分类"),
  mediaIds: z.array(z.string()).optional(),
  mainImageId: z.string().optional(),
  videoIds: z.array(z.string()).optional(),
  customAttributes: z.record(z.string(), z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  product?: any; // 编辑时传入的商品数据
}

export function CreateProductModal({
  open,
  onOpenChange,
  onSuccess,
  product,
}: CreateProductModalProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { data: templatesData = [] } = useTemplateList({
    page: 1,
    limit: 100,
  });

  const isEdit = !!product;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spuCode: "",
      siteName: "",
      siteDescription: "",
      siteCategoryId: "",
      templateId: undefined,
      mediaIds: [],
      mainImageId: undefined,
      videoIds: [],
      seoTitle: "",
      status: 1,
      customAttributes: {},
    },
  });

  // 当 product 变化时，重置表单
  React.useEffect(() => {
    if (product) {
      // 编辑模式：填充表单数据
      form.reset({
        spuCode: product.spuCode || "",
        siteName: product.siteName || product.name || "",
        siteDescription: product.siteDescription || product.description || "",
        siteCategoryId: product.siteCategoryId || "",
        templateId: product.templateId || undefined,
        seoTitle: product.seoTitle || "",
        status: product.status ?? 1,
        mediaIds: product.mediaIds || [],
        mainImageId: product.mainImageId || undefined,
        videoIds: product.videoIds || [],
        customAttributes: product.customAttributes || {},
      });
    } else {
      // 创建模式：重置表单
      form.reset();
    }
  }, [product, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateProduct.mutateAsync({
          id: product.id,
          data,
        });
      } else {
        await createProduct.mutateAsync(data);
      }
      onSuccess?.();
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // 错误已在 mutation 中处理
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    // 🔥 移除 form.reset()，避免干扰 useEffect 的数据加载
    // useEffect 会在 product 变化时自动处理重置
    onOpenChange(isOpen);
  };

  // 自动生成 SPU 编码
  const generateSpuCode = (name: string) => {
    const timestamp = Date.now().toString().slice(-6);
    const prefix = name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "")
      .slice(0, 6);
    return `${prefix}${timestamp}`;
  };

  return (
    <Dialog
      key={product?.id || "create"}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-175">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isEdit ? "编辑商品" : "创建新商品"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "修改商品信息" : "填写商品基本信息，创建新的SPU商品"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 工厂站专属字段：SPU编码 */}
            <HasFactory>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="spuCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SPU编码 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：PRD001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div />
              </div>
            </HasFactory>

            {/* 所有站点都可见的字段 */}
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品名称 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入商品名称"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // 如果还没有 SPU 编码，自动生成
                        if (!form.getValues("spuCode")) {
                          form.setValue(
                            "spuCode",
                            generateSpuCode(e.target.value)
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入商品详细描述"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="">
              {/* 工厂站专属字段：计量单位和属性模板 */}
              <HasFactory>
                <div />
              </HasFactory>

              <HasFactory>
                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>属性模板 *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border p-2"
                          onChange={(e) =>
                            field.onChange(e.target.value || undefined)
                          }
                          value={field.value || ""}
                        >
                          <option value="">选择属性模板</option>
                          {templatesData.map((template: any) => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </HasFactory>
            </div>

            <FormField
              control={form.control}
              name="siteCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>站点分类 *</FormLabel>
                  <FormControl>
                    <SiteCategoryTreeSelect
                      onChange={field.onChange}
                      placeholder="请选择站点分类"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 商品独有属性 */}
            <FormField
              control={form.control}
              name="customAttributes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttributeEditor
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 工厂站专属字段：媒体资源 */}
            <HasFactory>
              <FormField
                control={form.control}
                name="mediaIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品图片</FormLabel>
                    <FormControl>
                      <MediaSelect
                        max={10}
                        multiple
                        onChange={(ids) => field.onChange(ids)}
                        value={field.value || []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mainImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>主图</FormLabel>
                    <FormControl>
                      <MediaSelect
                        availableMediaIds={form.watch("mediaIds")}
                        onChange={(ids) =>
                          field.onChange(ids.length > 0 ? ids[0] : undefined)
                        }
                        placeholder="选择商品主图（从已选图片中选择）"
                        value={field.value ? [field.value] : []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="videoIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品视频</FormLabel>
                    <FormControl>
                      <MediaSelect
                        maxCount={5}
                        multiple
                        onChange={(ids) => field.onChange(ids)}
                        placeholder="选择商品视频"
                        value={field.value || []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </HasFactory>

            <DialogFooter>
              <Button
                disabled={createProduct.isPending || updateProduct.isPending}
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                取消
              </Button>
              <Button
                disabled={createProduct.isPending || updateProduct.isPending}
                type="submit"
              >
                {createProduct.isPending || updateProduct.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "保存中..." : "创建中..."}
                  </>
                ) : isEdit ? (
                  "保存商品"
                ) : (
                  "创建商品"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
