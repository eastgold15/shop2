// components/MediaUpload.tsx
"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBatchUploadMedia } from "@/hooks/api";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "@/components/ui/upload";

const CATEGORY_OPTIONS = [
  { value: "product", label: "商品图片" },
  { value: "hero_card", label: "首页卡片" },
  { value: "ad", label: "广告图片" },
  { value: "document", label: "文档资料" },
  { value: "general", label: "通用文件" },
];

export function MediaUpload({
  children,
  onUploadComplete,
}: {
  children: React.ReactNode;
  onUploadComplete?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState<string>("general");
  const { mutateAsync, isPending } = useBatchUploadMedia();

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {/* asChild 必须加上，它会将 Dialog 的打开逻辑绑定到你的 Button 上 */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-3xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">上传媒体资源</DialogTitle>
          <DialogDescription>
            选择分类后，选择或拖拽文件到预览区，可以修改文件名，然后点击上传按钮。
          </DialogDescription>
        </DialogHeader>

        {/* 分类选择 */}
        <div className="space-y-2">
          <Label htmlFor="category-select">文件分类 *</Label>
          <Select
            defaultValue="general"
            onValueChange={(value) => setCategory(value)}
            value={category}
          >
            <SelectTrigger className="w-full" id="category-select">
              <SelectValue placeholder="选择文件分类" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-slate-500 text-xs">
            选择合适的分类有助于更好地组织和管理您的媒体文件
          </p>
        </div>

        <div className="py-4">
          <Upload
            autoUpload={false}
            multiple // 手动上传模式
            onUpload={async (files) => {
              console.log("开始上传文件数量:", files.length, "分类:", category);

              try {
                // 一次性上传所有文件（后端支持数组）
                const result = await mutateAsync({
                  files,
                  category, // 使用用户选择的分类
                });
                console.log("所有文件上传成功:", result);

                toast.success(`成功上传 ${files.length} 个文件！`);
                setOpen(false); // 上传成功自动关窗
                setCategory("general"); // 重置分类选择
                onUploadComplete?.(); // 刷新列表数据
              } catch (error) {
                console.error("批量上传失败:", error);
                const errorMessage =
                  error instanceof Error ? error.message : "上传失败";
                toast.error(errorMessage);
                // 不要重新抛出错误，让 Upload 组件自己标记失败状态
              }
            }}
          />
        </div>

        {isPending && (
          <div className="flex items-center justify-center gap-2 pb-4 font-medium text-indigo-600 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            正在同步到服务器...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
