// components/product/product-list.tsx
"use client";

import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageGallery } from "@/components/ui/image-gallery";
import { Product } from "@/hooks/api/product.type";
import { SkuListRes } from "@/hooks/api/sku.type";
import { cn } from "@/lib/utils";
import { SkuPanel } from "./SkuPanel";

interface ProductListProps {
  products: Product[];
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  viewMode: "global" | "my";
  onSelect: (id: string, checked: boolean) => void;
  onToggleExpand: (id: string) => void;
  // 操作回调
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onCreateSku: (id: string) => void;
  onEditSku: (sku: SkuListRes) => void;
  onDeleteSku: (id: string, code: string) => void;
}

export function ProductList({
  products,
  selectedIds,
  expandedIds,
  viewMode,
  onSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  onCreateSku,
  onEditSku,
  onDeleteSku,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <p className="font-semibold">暂无商品</p>
          <p className="text-muted-foreground text-sm">
            点击右上角按钮开始创建。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {products.map((product) => {
        const isExpanded = expandedIds.has(product.id);
        const isSelected = selectedIds.has(product.id);

        return (
          <Collapsible
            className={cn(
              "overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
              isSelected && "border-indigo-500 ring-1 ring-indigo-500"
            )}
            key={product.id}
            onOpenChange={() => onToggleExpand(product.id)}
            open={isExpanded}
          >
            <div className="flex items-center gap-4 p-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(c) => onSelect(product.id, !!c)}
              />

              {product.mainImage ? (
                <ImageGallery
                  images={[
                    {
                      id: product.mainImageId || product.id,
                      url: product.mainImage,
                      isMain: true,
                      originalName: product.name,
                    },
                  ]}
                  size="md"
                />
              ) : (
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-slate-100 text-muted-foreground text-xs">
                  No Img
                </div>
              )}

              <div className="grid flex-1 gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold leading-none">{product.name}</h3>
                  <Badge
                    className="h-5 px-1.5 text-[10px]"
                    variant={product.status === 1 ? "default" : "secondary"}
                  >
                    {product.status === 1 ? "发布" : "草稿"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span>编码: {product.spuCode}</span>
                  <span>SKU: {product.skuCount}</span>
                </div>
              </div>

              <div className="hidden text-right sm:block">
                <div className="font-medium">
                  ¥{product.sitePrice || "0.00"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button
                    className="h-8 gap-1 text-xs"
                    size="sm"
                    variant="ghost"
                  >
                    {isExpanded ? "收起" : "展开 SKU"}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      编辑商品
                    </DropdownMenuItem>
                    <Can permission="SKU_CREATE">
                      <DropdownMenuItem onClick={() => onCreateSku(product.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        添加 SKU
                      </DropdownMenuItem>
                    </Can>
                    <Can permission="PRODUCT_DELETE">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(product)}
                      >
                        删除商品
                      </DropdownMenuItem>
                    </Can>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CollapsibleContent>
              <SkuPanel
                onDelete={onDeleteSku}
                onEdit={onEditSku}
                skus={product.skus}
                viewMode={viewMode}
              />
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
