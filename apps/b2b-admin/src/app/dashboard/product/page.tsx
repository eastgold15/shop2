"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { CreateProductModal } from "@/components/form/CreateProductModal";
import { CreateSKUModal } from "@/components/form/CreateSKUModal";
import { EditSKUModal } from "@/components/form/EditSKUModal";
import { VariantMediaModal } from "@/components/form/VariantMediaModal";
import { HeaderToolbar } from "@/components/product/HeaderToolbar";
import { ProductList } from "@/components/product/ProductList";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  useBatchDeleteProduct,
  useDeleteProduct,
  useProductPageList,
} from "@/hooks/api/product";
import { Product } from "@/hooks/api/product.type";
import { useDeleteSku } from "@/hooks/api/sku";
import { SkuListRes } from "@/hooks/api/sku.type";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"global" | "my">("my");
  const { data, isLoading, refetch } = useProductPageList({
    page: 1,
    limit: 100,
    isListed: viewMode === "my",
  });
  const deleteSkuMutation = useDeleteSku();
  const deleteProductMutation = useBatchDeleteProduct();
  const deleteSingleProductMutation = useDeleteProduct();

  // --- 2. 状态 ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // 弹窗控制
  const [productModal, setProductModal] = useState<{
    open: boolean;
    data?: Product;
  }>({ open: false });
  const [skuCreateId, setSkuCreateId] = useState<string | null>(null);
  const [skuEditData, setSkuEditData] = useState<SkuListRes | null>(null);
  const [variantMediaProductId, setVariantMediaProductId] = useState<
    string | null
  >(null);

  // --- 3. 逻辑处理 ---
  const filteredProducts =
    data?.data.filter(
      (p: Product) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.spuCode.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // 切换选中
  const handleSelect = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    setSelectedIds(next);
  };

  // 切换展开
  const handleToggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedIds(next);
  };

  // 各种删除逻辑 (简化示例)
  const handleDeleteSku = async (id: string, code: string) => {
    if (!confirm(`确认删除 SKU ${code}?`)) return;
    await deleteSkuMutation.mutateAsync(id);
    toast.success("已删除");
    refetch();
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`确认删除商品 "${product.name}"?`)) return;
    await deleteSingleProductMutation.mutateAsync(product.id);
    toast.success("商品已删除");
    refetch();
  };

  const handleBatchDelete = async () => {
    if (!confirm(`确认删除 ${selectedIds.size} 个商品?`)) return;
    await deleteProductMutation.mutateAsync(Array.from(selectedIds));
    setSelectedIds(new Set());
    toast.success("批量删除成功");
    refetch();
  };

  if (isLoading) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden bg-slate-50/50">
        {/* 模块 1: 头部与工具栏 */}
        <HeaderToolbar
          onAdd={() => setProductModal({ open: true })}
          onBatchDelete={handleBatchDelete}
          onSearchChange={setSearchTerm}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          // 集团站点隐藏"添加商品"按钮
          selectedCount={selectedIds.size}
          viewMode={viewMode}
        />

        {/* 模块 2: 滚动列表区域 */}
        <div className="flex-1 overflow-y-auto">
          <ProductList
            expandedIds={expandedIds}
            onCreateSku={(id) => setSkuCreateId(id)}
            onDelete={handleDeleteProduct}
            onDeleteSku={handleDeleteSku}
            onEdit={(p) => setProductModal({ open: true, data: p })}
            onEditSku={(sku) => setSkuEditData(sku)}
            onManageVariantMedia={setVariantMediaProductId}
            onSelect={handleSelect}
            onToggleExpand={handleToggleExpand}
            products={filteredProducts}
            selectedIds={selectedIds}
            viewMode={viewMode}
          />
        </div>

        {/* 模块 3 (隐式): 弹窗挂载 */}
        {/* 弹窗始终渲染，通过控制内部显示创建/编辑字段 */}
        <CreateProductModal
          onOpenChange={(open) =>
            setProductModal({
              open,
              data: open ? productModal.data : undefined,
            })
          }
          onSuccess={refetch}
          open={productModal.open}
          product={productModal.data}
        />
        <CreateSKUModal
          onOpenChange={() => setSkuCreateId(null)}
          onSuccess={refetch}
          open={!!skuCreateId}
          productId={skuCreateId || undefined}
        />
        <EditSKUModal
          onOpenChange={() => setSkuEditData(null)}
          onSuccess={refetch}
          open={!!skuEditData}
          sku={skuEditData || undefined}
        />
        <VariantMediaModal
          onOpenChange={() => setVariantMediaProductId(null)}
          onSuccess={refetch}
          open={!!variantMediaProductId}
          productId={variantMediaProductId || ""}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
