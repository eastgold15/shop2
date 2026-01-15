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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductPageList } from "@/hooks/api/product";
import { useBatchCreateSku } from "@/hooks/api/sku";
import {
  calculateEstimatedCount,
  generateCartesianProduct,
} from "@/utils/sku-generator";

// --- Schema 定义 ---
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

  // 获取商品列表
  const { data: productsData } = useProductPageList({
    page: 1,
    limit: 100,
  });

  // 生成器状态
  const [generatorData, setGeneratorData] = useState<Record<string, string[]>>(
    {}
  );

  // 批量设置状态
  const [batchPrice, setBatchPrice] = useState<number | null>(null);
  const [batchStock, setBatchStock] = useState<number | null>(null);
  const [batchWeight, setBatchWeight] = useState<number | null>(null);
  const [batchVolume, setBatchVolume] = useState<number | null>(null);
  const [batchMarketPrice, setBatchMarketPrice] = useState<number | null>(null);
  const [batchCostPrice, setBatchCostPrice] = useState<number | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: productId || "",
      baseSkuCode: "",
      skus: [],
    },
  });

  const { fields, replace, remove, update } = useFieldArray({
    control: form.control,
    name: "skus",
  });

  const selectedProductId = form.watch("productId");
  const currentProduct = useMemo(
    () => productsData?.data?.find((p: any) => p.id === selectedProductId),
    [productsData, selectedProductId]
  );

  // 同步外部 productId
  useEffect(() => {
    if (productId) {
      form.setValue("productId", productId);
    }
  }, [productId, form]);

  // 重置生成器
  useEffect(() => {
    setGeneratorData({});
    replace([]);
    if (currentProduct?.spuCode) {
      form.setValue("baseSkuCode", currentProduct.spuCode);
    }
  }, [currentProduct, form, replace]);

  // 生成 SKU
  const handleGenerate = () => {
    if (!currentProduct?.specs) return;

    const attributes = currentProduct.specs
      .map((spec: any) => ({
        key: spec.key,
        values: generatorData[spec.key] || [],
      }))
      .filter((attr: any) => attr.values.length > 0);

    if (attributes.length === 0) return;

    const combinations = generateCartesianProduct(attributes);

    const newSkus = combinations.map((specJson) => ({
      skuCode: "",
      price: 0,
      stock: 0,
      specJson,
      mediaIds: [],
    }));

    replace(newSkus);
  };

  // 批量设置所有字段
  const handleApplyBatchSettings = () => {
    fields.forEach((_, index) => {
      if (batchPrice !== null) {
        form.setValue(`skus.${index}.price`, batchPrice);
      }
      if (batchStock !== null) {
        form.setValue(`skus.${index}.stock`, batchStock);
      }
      if (batchWeight !== null) {
        form.setValue(`skus.${index}.weight`, batchWeight);
      }
      if (batchVolume !== null) {
        form.setValue(`skus.${index}.volume`, batchVolume);
      }
      if (batchMarketPrice !== null) {
        form.setValue(`skus.${index}.marketPrice`, batchMarketPrice);
      }
      if (batchCostPrice !== null) {
        form.setValue(`skus.${index}.costPrice`, batchCostPrice);
      }
    });
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

  const estimatedCount = calculateEstimatedCount(generatorData);

  return (
    <Dialog
      key={productId || "create"}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-screen-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" />
            批量创建 SKU
          </DialogTitle>
          <DialogDescription>
            使用规格生成器快速组合生成 SKU 列表，并设置价格、库存等属性
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

            {/* === 2. 规格生成器区域 === */}
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
                        onChange={(vals) =>
                          setGeneratorData((prev) => ({
                            ...prev,
                            [spec.key]: vals,
                          }))
                        }
                        options={spec.options || []}
                        placeholder={`选择或输入${spec.label}...`}
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

            {/* === 3. 生成结果列表 === */}
            {fields.length > 0 && (
              <div className="space-y-4">
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

                {/* Tabs：列表视图 | 批量设置 */}
                <Tabs className="w-full" defaultValue="list">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">列表视图</TabsTrigger>
                    <TabsTrigger value="batch">批量设置</TabsTrigger>
                  </TabsList>

                  {/* 列表视图 */}
                  <TabsContent className="space-y-2" value="list">
                    <div className="max-h-[500px] overflow-y-auto rounded-md border">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-slate-50">
                          <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            {currentProduct?.specs?.map((spec) => (
                              <TableHead key={spec.key}>{spec.label}</TableHead>
                            ))}
                            <TableHead className="w-[100px]">
                              销售价 *
                            </TableHead>
                            <TableHead className="w-[100px]">市场价</TableHead>
                            <TableHead className="w-[100px]">成本价</TableHead>
                            <TableHead className="w-[80px]">库存 *</TableHead>
                            <TableHead className="w-[80px]">重量</TableHead>
                            <TableHead className="w-[80px]">体积</TableHead>
                            <TableHead className="w-[150px]">
                              SKU 预览
                            </TableHead>
                            <TableHead className="w-[50px]" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium text-muted-foreground text-xs">
                                {index + 1}
                              </TableCell>

                              {/* 规格值 */}
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

                              {/* 销售价 */}
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

                              {/* 市场价 */}
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`skus.${index}.marketPrice`}
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

                              {/* 成本价 */}
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`skus.${index}.costPrice`}
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

                              {/* 库存 */}
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
                                          Number.parseInt(e.target.value, 10) ||
                                            0
                                        )
                                      }
                                      type="number"
                                    />
                                  )}
                                />
                              </TableCell>

                              {/* 重量 */}
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`skus.${index}.weight`}
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

                              {/* 体积 */}
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`skus.${index}.volume`}
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
                  </TabsContent>

                  {/* 批量设置 */}
                  <TabsContent className="space-y-4" value="batch">
                    <div className="rounded-lg border bg-slate-50 p-4">
                      <h4 className="mb-4 font-medium text-sm">批量设置属性</h4>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {/* 销售价 */}
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs">
                            统一销售价
                          </label>
                          <Input
                            min={0}
                            onChange={(e) =>
                              setBatchPrice(
                                Number.parseFloat(e.target.value) || null
                              )
                            }
                            placeholder="留空则不设置"
                            step={0.01}
                            type="number"
                          />
                        </div>

                        {/* 市场价 */}
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs">
                            统一市场价
                          </label>
                          <Input
                            min={0}
                            onChange={(e) =>
                              setBatchMarketPrice(
                                Number.parseFloat(e.target.value) || null
                              )
                            }
                            placeholder="留空则不设置"
                            step={0.01}
                            type="number"
                          />
                        </div>

                        {/* 成本价 */}
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs">
                            统一成本价
                          </label>
                          <Input
                            min={0}
                            onChange={(e) =>
                              setBatchCostPrice(
                                Number.parseFloat(e.target.value) || null
                              )
                            }
                            placeholder="留空则不设置"
                            step={0.01}
                            type="number"
                          />
                        </div>

                        {/* 库存 */}
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs">
                            统一库存
                          </label>
                          <Input
                            min={0}
                            onChange={(e) =>
                              setBatchStock(
                                Number.parseInt(e.target.value, 10) || null
                              )
                            }
                            placeholder="留空则不设置"
                            type="number"
                          />
                        </div>

                        {/* 重量 */}
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs">
                            统一重量 (kg)
                          </label>
                          <Input
                            min={0}
                            onChange={(e) =>
                              setBatchWeight(
                                Number.parseFloat(e.target.value) || null
                              )
                            }
                            placeholder="留空则不设置"
                            step={0.01}
                            type="number"
                          />
                        </div>

                        {/* 体积 */}
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs">
                            统一体积 (m³)
                          </label>
                          <Input
                            min={0}
                            onChange={(e) =>
                              setBatchVolume(
                                Number.parseFloat(e.target.value) || null
                              )
                            }
                            placeholder="留空则不设置"
                            step={0.01}
                            type="number"
                          />
                        </div>
                      </div>

                      <Button
                        className="mt-4 w-full"
                        onClick={handleApplyBatchSettings}
                        type="button"
                        variant="outline"
                      >
                        应用到全部 {fields.length} 个 SKU
                      </Button>
                    </div>

                    <div className="rounded-lg border bg-amber-50 p-4">
                      <p className="text-muted-foreground text-xs">
                        💡 提示：图片和其他详细信息建议在 SKU
                        创建后，点击"编辑"按钮单独设置。
                        批量创建时主要设置核心的价格、库存和物理属性。
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
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
}
