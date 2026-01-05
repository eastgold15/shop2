"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackagePlus, Trash2, Wand2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
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
// 请确保路径正确引入你的组件和工具函数
import { MultiTagInput } from "@/components/ui/multi-tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductPageList } from "@/hooks/api/product";
import { useBatchCreateSku } from "@/hooks/api/sku";
import {
  calculateEstimatedCount,
  generateCartesianProduct,
} from "@/utils/sku-generator";

// --- Schema 定义保持不变 ---
const skuSchema = z.object({
  skuCode: z.string().optional(),
  price: z.number().min(0, "价格不能小于0"),
  marketPrice: z.number().optional(),
  costPrice: z.number().optional(),
  weight: z.number().optional(),
  volume: z.number().optional(),
  stock: z.number().min(0, "库存不能小于0"),
  specJson: z.record(z.string(), z.string()),
  mediaIds: z.array(z.string()).optional(),
  extraAttributes: z.record(z.string(), z.any()).optional(),
});

const formSchema = z.object({
  productId: z.string().min(1, "请选择商品"),
  skus: z.array(skuSchema).min(1, "至少需要创建一个SKU"),
  baseSkuCode: z.string().min(1, "请输入基础SKU编码"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateSKUModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  productId?: string;
}

export function CreateSKUModal({
  open,
  onOpenChange,
  onSuccess,
  productId,
}: CreateSKUModalProps) {
  const createSKUBatch = useBatchCreateSku();

  // 获取商品列表 (包含 specs 和 options)
  const { data: productsData } = useProductPageList({
    page: 1,
    limit: 100,
  });

  // 1. 定义生成器状态: { "color": ["红", "蓝"], "size": ["40", "41"] }
  const [generatorData, setGeneratorData] = useState<Record<string, string[]>>(
    {}
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: productId || "",
      baseSkuCode: "",
      skus: [], // 初始为空，等待生成
    },
  });

  const { fields, replace, remove } = useFieldArray({
    control: form.control,
    name: "skus",
  });

  // 获取当前选中的 productId
  const selectedProductId = form.watch("productId");

  // 计算当前选中的商品详情
  const currentProduct = useMemo(
    () => productsData?.data?.find((p: any) => p.id === selectedProductId),
    [productsData, selectedProductId]
  );

  // 当外部传入 productId 时同步到表单
  useEffect(() => {
    if (productId) {
      form.setValue("productId", productId);
    }
  }, [productId, form]);

  // 当选中的商品变化时，重置生成器数据，并自动填入 SPU Code
  useEffect(() => {
    setGeneratorData({}); // 清空生成器选择
    replace([]); // 清空已生成的列表

    if (currentProduct?.spuCode) {
      form.setValue("baseSkuCode", currentProduct.spuCode);
    }
  }, [currentProduct, form, replace]);

  // 处理规格生成器值变化
  const handleGeneratorChange = (key: string, values: string[]) => {
    setGeneratorData((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  // 核心：点击“生成”按钮
  const handleGenerate = () => {
    if (!currentProduct?.specs) return;

    // 1. 准备数据给算法
    // 过滤掉用户没有选值的规格，只处理有值的
    const attributes = currentProduct.specs
      .map((spec: any) => ({
        key: spec.key,
        values: generatorData[spec.key] || [],
      }))
      .filter((attr: any) => attr.values.length > 0);

    if (attributes.length === 0) return;

    // 2. 调用算法生成笛卡尔积
    const combinations = generateCartesianProduct(attributes);

    // 3. 转换为表单数据格式
    const newSkus = combinations.map((specJson) => ({
      skuCode: "",
      price: 0,
      stock: 0,
      specJson, // 这里直接就是 { "color": "红", "size": "40" }
      mediaIds: [],
    }));

    // 4. 替换表单中的 skus 数组
    replace(newSkus);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const processedSkus = data.skus.map((sku, index) => ({
        skuCode: `${data.baseSkuCode}-${String(index + 1).padStart(3, "0")}`,
        price: sku.price.toString(),
        stock: sku.stock.toString(),
        marketPrice: sku.marketPrice?.toString() || null,
        costPrice: sku.costPrice?.toString() || null,
        weight: sku.weight?.toString() || null,
        volume: sku.volume?.toString() || null,
        specJson: sku.specJson,
        mediaIds: sku.mediaIds,
      }));

      await createSKUBatch.mutateAsync({
        productId: data.productId,
        skus: processedSkus,
      });

      onSuccess?.();
      form.reset();
      setGeneratorData({});
      onOpenChange(false);
    } catch (error) {
      console.error("Create SKU error:", error);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setGeneratorData({});
    }
    onOpenChange(isOpen);
  };

  // 计算预计生成的数量，用于按钮提示
  const estimatedCount = calculateEstimatedCount(generatorData);

  return (
    <>
      (
      <Dialog
        key={productId || "create"}
        onOpenChange={handleOpenChange}
        open={open}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5" />
              批量创建 SKU
            </DialogTitle>
            <DialogDescription>
              使用规格生成器快速组合生成 SKU 列表
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* === 1. 基础选择区域 === */}
              <div className="grid grid-cols-2 gap-4">
                {!productId && (
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>选择商品</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="请选择商品以加载规格" />
                            </SelectTrigger>
                            <SelectContent>
                              {productsData?.data?.map((product: any) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="baseSkuCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>基础 SKU 编码前缀</FormLabel>
                      <FormControl>
                        <Input placeholder="例如: NIK-AIR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* === 2. 规格生成器区域 (Generator) === */}
              {selectedProductId &&
              currentProduct?.specs &&
              currentProduct.specs.length > 0 ? (
                <div className="rounded-lg border bg-slate-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-sm">规格生成器</h3>
                    <Badge className="bg-white" variant="outline">
                      已选商品模板: {currentProduct.name}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {currentProduct.specs.map((spec: any) => (
                      <div className="space-y-1.5" key={spec.key}>
                        <label className="font-medium text-muted-foreground text-xs">
                          {spec.label || spec.key} ({spec.key})
                        </label>
                        <MultiTagInput
                          allowCustom={true}
                          // 🔥 核心：传入后端返回的 options
                          onChange={(vals) =>
                            handleGeneratorChange(spec.key, vals)
                          }
                          options={spec.options || []}
                          placeholder={`选择或输入${spec.label}...`}
                          // 如果 inputType 是 select，通常建议只允许选，如果不限则 allowCustom={true}
                          value={generatorData[spec.key] || []}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    className="mt-4 w-full"
                    disabled={estimatedCount === 0}
                    onClick={handleGenerate}
                    type="button"
                    variant="secondary"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    生成 SKU 列表{" "}
                    {estimatedCount > 0 && `(预计 ${estimatedCount} 个)`}
                  </Button>
                </div>
              ) : selectedProductId ? (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-muted-foreground text-sm">
                  该商品未配置规格模板，请联系管理员或选择其他商品。
                </div>
              ) : null}

              {/* === 3. 生成结果列表 (Table Mode) === */}
              {fields.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                      已生成 {fields.length} 个 SKU
                    </h3>
                    <Button
                      className="text-destructive hover:text-destructive"
                      onClick={() => replace([])}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      清空列表
                    </Button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto rounded-md border">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-slate-50">
                        <TableRow>
                          <TableHead className="w-[50px]">#</TableHead>
                          {/* 动态渲染规格表头 */}
                          {currentProduct?.specs?.map((spec: any) => (
                            <TableHead key={spec.key}>{spec.label}</TableHead>
                          ))}
                          <TableHead className="w-[120px]">价格 *</TableHead>
                          <TableHead className="w-[120px]">库存 *</TableHead>
                          <TableHead className="w-[150px]">SKU 预览</TableHead>
                          <TableHead className="w-[50px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell className="font-medium text-muted-foreground text-xs">
                              {index + 1}
                            </TableCell>

                            {/* 动态渲染规格值 (只读) */}
                            {currentProduct?.specs?.map((spec: any) => (
                              <TableCell key={spec.key}>
                                <Badge
                                  className="font-normal"
                                  variant="secondary"
                                >
                                  {form.watch(
                                    `skus.${index}.specJson.${spec.key}`
                                  ) || "-"}
                                </Badge>
                              </TableCell>
                            ))}

                            {/* 价格输入 */}
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`skus.${index}.price`}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    className="h-8 w-full"
                                    min={0}
                                    onChange={(e) =>
                                      field.onChange(
                                        Number.parseFloat(e.target.value) || 0
                                      )
                                    }
                                    step={0.01}
                                    type="number"
                                  />
                                )}
                              />
                            </TableCell>

                            {/* 库存输入 */}
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`skus.${index}.stock`}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    className="h-8 w-full"
                                    min={0}
                                    onChange={(e) =>
                                      field.onChange(
                                        Number.parseInt(e.target.value, 10) || 0
                                      )
                                    }
                                    type="number"
                                  />
                                )}
                              />
                            </TableCell>

                            {/* SKU 预览 */}
                            <TableCell>
                              <span className="block max-w-[150px] truncate text-muted-foreground text-xs">
                                {form.watch("baseSkuCode")
                                  ? `${form.watch("baseSkuCode")}-${String(index + 1).padStart(3, "0")}`
                                  : "-"}
                              </span>
                            </TableCell>

                            {/* 操作 */}
                            <TableCell>
                              <Button
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                                size="icon"
                                type="button"
                                variant="ghost"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 底部提示：如果需要设置图片或其他字段，可以在这里加批量设置，或者不做 */}
                  <div className="px-1 text-muted-foreground text-xs">
                    * 更多详细信息（如图片、重量、体积）请在创建后点击详情编辑
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  disabled={createSKUBatch.isPending}
                  onClick={() => onOpenChange(false)}
                  type="button"
                  variant="outline"
                >
                  取消
                </Button>
                <Button
                  disabled={createSKUBatch.isPending || fields.length === 0}
                  type="submit"
                >
                  {createSKUBatch.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    `确认创建 ${fields.length} 个 SKU`
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      );
    </>
  );
}
