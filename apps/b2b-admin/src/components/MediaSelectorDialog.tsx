"use client";

import { Check, Image as ImageIcon, Search, Video, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/ui/category-select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaList } from "@/hooks/api";

interface MediaSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mediaIds: string[]) => void;
  multiple?: boolean;
  maxCount?: number;
  initialSelected?: string[];
  category?: string;
  availableMediaIds?: string[]; // 限制只能从这些ID中选择
}

export function MediaSelectorDialog({
  open,
  onOpenChange,
  onSelect,
  multiple = true,
  maxCount = 10,
  initialSelected = [],
  category = "",
  availableMediaIds,
}: MediaSelectorDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelected)
  );
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  // 内部分类状态，使用传入的 category 作为初始值
  const [internalCategory, setInternalCategory] = useState(category || "");

  // 获取媒体列表
  const { data: mediaListData, isLoading } = useMediaList({
    category: internalCategory,
    search,
  });

  const mediaList = (mediaListData || []).filter((media) => {
    // 如果有可用ID限制，只显示这些媒体
    if (availableMediaIds && availableMediaIds.length > 0) {
      return availableMediaIds.includes(media.id);
    }
    return true;
  });

  // 过滤媒体类型
  const filteredMedia = mediaList.filter((media) => {
    if (activeTab === "image") {
      return media.mimeType?.startsWith("image/");
    }
    return media.mimeType?.startsWith("video/");
  });

  // 选择/取消选择媒体
  const toggleSelect = (mediaId: string) => {
    const newSelected = new Set(selectedIds);

    if (newSelected.has(mediaId)) {
      newSelected.delete(mediaId);
    } else if (multiple) {
      if (newSelected.size < maxCount) {
        newSelected.add(mediaId);
      }
    } else {
      newSelected.clear();
      newSelected.add(mediaId);
    }

    setSelectedIds(newSelected);
  };

  // 确认选择
  const handleConfirm = () => {
    onSelect(Array.from(selectedIds));
    onOpenChange(false);
    // 重置选择状态
    setSelectedIds(new Set());
  };

  // 关闭对话框
  const handleClose = () => {
    onOpenChange(false);
    // 重置选择状态
    setSelectedIds(new Set(initialSelected));
  };

  // 检查是否是视频
  const isVideo = (mimeType: string) => mimeType?.startsWith("video/");

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>选择媒体文件</DialogTitle>
        </DialogHeader>

        {/* 固定顶部：搜索和分类 */}
        <div className="space-y-3 border-b px-6">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索媒体文件..."
              value={search}
            />
          </div>

          {/* 分类和类型切换 */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="media-category-select">文件分类</Label>
              <CategorySelect
                allowClear={true}
                id="media-category-select"
                onChange={setInternalCategory}
                placeholder="全部分类"
                value={internalCategory}
              />
            </div>

            <Tabs
              onValueChange={(v) => setActiveTab(v as "image" | "video")}
              value={activeTab}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="image">
                  <ImageIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Video className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* 可滚动内容区：图片列表 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <ImageIcon className="mb-2 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                {search ? "没有找到匹配的媒体文件" : "暂无媒体文件"}
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                {filteredMedia.map((media) => {
                  const isSelected = selectedIds.has(media.id);
                  const video = isVideo(media.mimeType || "");

                  return (
                    <div
                      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${
                        isSelected
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      key={media.id}
                      onClick={() => toggleSelect(media.id)}
                    >
                      {video ? (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ) : (
                        <Image
                          alt={media.originalName || "媒体"}
                          className="h-full w-full object-cover"
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          src={media.url}
                        />
                      )}

                      {/* 选中标记 */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}

                      {/* 视频标记 */}
                      {video && (
                        <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50">
                          <Video className="h-3 w-3 text-white" />
                        </div>
                      )}

                      {/* 悬停显示文件名 */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="truncate text-white text-xs">
                          {media.originalName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 固定底部：选择提示和按钮 */}
        <div className="space-y-3 border-t px-6 py-4">
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <span>
                已选择 {selectedIds.size}
                {multiple && ` / ${maxCount}`} 个文件
              </span>
              <Button
                onClick={() => setSelectedIds(new Set())}
                size="sm"
                variant="ghost"
              >
                <X className="mr-1 h-3 w-3" />
                清空选择
              </Button>
            </div>
          )}
          <DialogFooter className="px-0 pb-0">
            <Button onClick={handleClose} variant="outline">
              取消
            </Button>
            <Button disabled={selectedIds.size === 0} onClick={handleConfirm}>
              确认选择
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
