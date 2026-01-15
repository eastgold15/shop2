import { Download, Filter, Plus, Search, Trash2 } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HasGroup } from "../auth/Has";

interface HeaderToolbarProps {
  selectedCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAdd: () => void;
  onBatchDelete: () => void;
  viewMode: "global" | "my";
  onViewModeChange: (mode: "global" | "my") => void;
}

export function HeaderToolbar({
  selectedCount,
  searchTerm,
  onSearchChange,
  onAdd,
  onBatchDelete,
  viewMode,
  onViewModeChange,
}: HeaderToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator className="mr-2 h-4" orientation="vertical" />
        <h1 className="font-semibold text-lg leading-none tracking-tight">
          商品管理
        </h1>
        {selectedCount > 0 && (
          <span className="ml-2 rounded-full bg-indigo-100 px-2.5 py-0.5 font-medium text-indigo-800 text-xs">
            已选 {selectedCount} 项
          </span>
        )}
      </div>

      {/* 第二行：工具栏 (搜索 + 按钮) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 md:max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="bg-background pl-8"
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索商品名称、编码..."
              type="search"
              value={searchTerm}
            />
          </div>
          {/* 商品池类型选择 */}
          <HasGroup>
            <div className="flex gap-2">
              <Button
                onClick={() => onViewModeChange("global")}
                size="sm"
                variant={viewMode === "global" ? "default" : "outline"}
              >
                全局商品
              </Button>
              <Button
                onClick={() => onViewModeChange("my")}
                size="sm"
                variant={viewMode === "my" ? "default" : "outline"}
              >
                我的商品
              </Button>
            </div>
          </HasGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="shrink-0" size="icon" variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>状态筛选</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                已发布
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>草稿箱</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Can permission="PRODUCT_CREATE">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={onAdd}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              新建商品
            </Button>
          </Can>

          {selectedCount > 0 && (
            <Can permission="PRODUCT_DELETE">
              <Button onClick={onBatchDelete} size="sm" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                批量删除 ({selectedCount})
              </Button>
            </Can>
          )}

          <Button className="hidden sm:flex" size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>
    </div>
  );
}
