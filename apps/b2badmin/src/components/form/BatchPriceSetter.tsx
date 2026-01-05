"use client";

import { Wand2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BatchPriceSetterProps {
  onApply: (price: number, stock: number) => void;
  skuCount: number;
}

export function BatchPriceSetter({ onApply, skuCount }: BatchPriceSetterProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleApply = () => {
    const priceNum = Number.parseFloat(price) || 0;
    const stockNum = Number.parseInt(stock, 10) || 0;
    onApply(priceNum, stockNum);
    setOpen(false);
    setPrice("");
    setStock("");
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm" type="button" variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          批量设置价格和库存
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>批量设置 SKU 价格和库存</DialogTitle>
          <DialogDescription>
            将统一应用到所有 {skuCount} 个 SKU
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="batch-price">统一价格 *</Label>
            <Input
              id="batch-price"
              min={0}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="例如: 299"
              step={0.01}
              type="number"
              value={price}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch-stock">统一库存 *</Label>
            <Input
              id="batch-stock"
              min={0}
              onChange={(e) => setStock(e.target.value)}
              placeholder="例如: 100"
              type="number"
              value={stock}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
          >
            取消
          </Button>
          <Button disabled={!(price && stock)} onClick={handleApply}>
            应用到全部 SKU
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
