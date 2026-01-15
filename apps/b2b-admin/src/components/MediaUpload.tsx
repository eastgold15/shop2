// components/MediaUpload.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { CategorySelect } from "@/components/ui/category-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Upload } from "@/components/ui/upload";
import { useBatchUploadMedia } from "@/hooks/api";

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

  // 处理文件上传（一次性上传所有文件）
  const handleBatchUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      console.log("开始批量上传文件数量:", files.length, "分类:", category);

      const result = await mutateAsync({
        files,
        category,
      });
      console.log("所有文件上传成功:", result);

      toast.success(`成功上传 ${files.length} 个文件！`);
      setOpen(false);
      setCategory("general");
      onUploadComplete?.();
    } catch (error) {
      console.error("批量上传失败:", error);
      const errorMessage = error instanceof Error ? error.message : "上传失败";
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">上传媒体资源</DialogTitle>
          <DialogDescription>
            选择分类后，选择或拖拽文件到预览区，可以修改文件名，然后点击上传按钮。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="category-select">文件分类 *</Label>
          <CategorySelect
            allowClear={false}
            onChange={setCategory}
            placeholder="选择或输入分类..."
            value={category}
          />
          <p className="text-muted-foreground text-xs">
            从列表选择或直接输入新分类，常用分类会自动保存
          </p>
        </div>

        <div className="py-4">
          <Upload
            autoUpload={false}
            batchMode={true}
            multiple
            onError={(error) => {
              toast.error(error);
            }}
            onSuccess={() => {
              setTimeout(() => {
                setOpen(false);
                setCategory("general");
                onUploadComplete?.();
              }, 500);
            }}
            onUpload={handleBatchUpload}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
