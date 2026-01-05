"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
// 引入弹窗
import { CreateProductModal } from "@/components/form/CreateProductModal";
import { CreateSKUModal } from "@/components/form/CreateSKUModal";
import { EditSKUModal } from "@/components/form/EditSKUModal";
import { HeaderToolbar } from "@/components/product/HeaderToolbar";
import { ProductList } from "@/components/product/ProductList";
import { Product, Sku } from "@/components/product/type";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// Hooks & Types
import { useBatchDeleteProduct, useProductPageList } from "@/hooks/api/product";
import { useDeleteSku } from "@/hooks/api/sku";
import { useAuthStore } from "@/stores/auth-store";

// 引入三个核心组件

export default function ProductsPage() {
  // --- 1. 数据 ---
  const { data, isLoading, refetch } = useProductPageList({
    page: 1,
    limit: 100,
  });
  const deleteSkuMutation = useDeleteSku();
  const deleteProductMutation = useBatchDeleteProduct();

  // 获取当前站点类型（直接获取原始值避免无限循环）
  const siteType = useAuthStore((state) => state.getCurrentSite()?.siteType);

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
  const [skuEditData, setSkuEditData] = useState<Sku | null>(null);

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

  const handleBatchDelete = async () => {
    if (!confirm(`确认删除 ${selectedIds.size} 个商品?`)) return;
    await deleteProductMutation.mutateAsync(Array.from(selectedIds));
    setSelectedIds(new Set());
    toast.success("批量删除成功");
    refetch();
  };

  if (isLoading) return null; // 或者 loading skeleton

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden bg-slate-50/50">
        {/* 模块 1: 头部与工具栏 */}
        <HeaderToolbar
          onAdd={() => setProductModal({ open: true })}
          onBatchDelete={handleBatchDelete}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
          selectedCount={selectedIds.size}
          // 集团站点隐藏"添加商品"按钮
          showAddButton={siteType === "factory"}
        />

        {/* 模块 2: 滚动列表区域 */}
        <div className="flex-1 overflow-y-auto">
          <ProductList
            expandedIds={expandedIds}
            onCreateSku={(id) => setSkuCreateId(id)}
            onDelete={(p) => {
              /* 调用单个删除 */
            }}
            onDeleteSku={handleDeleteSku}
            onEdit={(p) => setProductModal({ open: true, data: p })}
            onEditSku={(sku) => setSkuEditData(sku)}
            onSelect={handleSelect}
            onToggleExpand={handleToggleExpand}
            products={filteredProducts}
            selectedIds={selectedIds}
            // 集团站点隐藏 SKU 创建功能
            showCreateSku={siteType === "factory"}
          />
        </div>

        {/* 模块 3 (隐式): 弹窗挂载 */}
        {/* 只有工厂站点才显示创建商品弹窗 */}
        {siteType === "factory" && (
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
        )}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
