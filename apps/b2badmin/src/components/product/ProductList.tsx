// components/product/product-list.tsx
import { Box, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
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
import { Product } from "@/hooks/api/product.type";
import { cn } from "@/lib/utils";
import { SkuPanel } from "./SkuPanel";

interface ProductListProps {
  products: Product[];
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onToggleExpand: (id: string) => void;
  // 操作回调
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onCreateSku: (id: string) => void;
  onEditSku: (sku: Sku) => void;
  onDeleteSku: (id: string, code: string) => void;
  showCreateSku?: boolean;
  /** 是否显示删除按钮（只有"我的商品"才显示） */
  showDelete?: boolean;
}

export function ProductList({
  products,
  selectedIds,
  expandedIds,
  onSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  onCreateSku,
  onEditSku,
  onDeleteSku,
  showCreateSku = true,
  showDelete = true,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <Box className="h-8 w-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">暂无商品</h3>
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
            {/* 商品主行 */}
            <div className="flex items-center gap-4 p-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(c) => onSelect(product.id, !!c)}
              />

              {/* 图片 */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-slate-100">
                {product.mainImage ? (
                  <Image
                    alt={product.name}
                    className="object-cover"
                    fill
                    src={product.mainImage}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    No Img
                  </div>
                )}
              </div>

              {/* 信息 */}
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

              {/* 价格 */}
              <div className="hidden text-right sm:block">
                <div className="font-medium">
                  ¥{product.sitePrice || "0.00"}
                </div>
              </div>

              {/* 操作区 */}
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
                    {showCreateSku && (
                      <DropdownMenuItem onClick={() => onCreateSku(product.id)}>
                        <Plus className="mr-2 h-4 w-4" /> 添加 SKU
                      </DropdownMenuItem>
                    )}
                    {showDelete && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(product)}
                      >
                        删除商品
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* 展开的 SKU 面板 */}
            <CollapsibleContent>
              <SkuPanel
                onDelete={onDeleteSku}
                onEdit={onEditSku}
                skus={product.skus}
              />
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
