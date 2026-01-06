// components/product/sku-panel.tsx
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/ui/image-gallery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkuListRes } from "@/hooks/api/sku.type";

interface SkuPanelProps {
  skus: SkuListRes[];
  onEdit: (sku: SkuListRes) => void;
  onDelete: (id: string, code: string) => void;
}

export function SkuPanel({ skus, onEdit, onDelete }: SkuPanelProps) {
  if (skus.length === 0) {
    return (
      <div className="flex h-24 flex-col items-center justify-center border-t bg-slate-50 text-muted-foreground text-sm">
        暂无 SKU 数据
      </div>
    );
  }

  return (
    <div className="fade-in zoom-in-95 animate-in border-t bg-slate-50/50 px-4 py-2 duration-200">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[180px]">SKU 编码</TableHead>
              <TableHead>规格属性</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>库存</TableHead>
              <TableHead>图片</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skus.map((sku) => (
              <TableRow key={sku.id}>
                <TableCell className="font-medium text-indigo-600">
                  {sku.skuCode}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(sku.specJson || {}).map(([k, v]) => (
                      <Badge
                        className="h-5 px-1 py-0 font-normal text-[10px]"
                        key={k}
                        variant="secondary"
                      >
                        {k}:{String(v)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>¥{sku.price}</TableCell>
                <TableCell>
                  <span
                    className={
                      Number(sku.stock) < 10 ? "font-bold text-red-500" : ""
                    }
                  >
                    {sku.stock}
                  </span>
                </TableCell>
                <TableCell>
                  {sku?.media && sku.media.length > 0 ? (
                    // 这里稍微hack一下，只显示图标，点击预览
                    <ImageGallery images={sku.media} size="sm" />
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      className="h-8 w-8 text-slate-500"
                      onClick={() => onEdit(sku)}
                      size="icon"
                      variant="ghost"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(sku.id, sku.skuCode)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
