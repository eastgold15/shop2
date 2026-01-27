"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  Search,
  Video,
  X,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaPageList } from "@/hooks/api";
import { isImageFile, isVideoFile } from "@/utils/media";

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
  // 分页状态
  const [page, setPage] = useState(1);
  const limit = 20; // 每页20个

  // 获取媒体列表（使用分页）
  const { data: pageData, isLoading } = useMediaPageList({
    page,
    limit,
    category: internalCategory || undefined,
    search: search || undefined,
  });

  const mediaList = pageData?.data || [];
  const total = pageData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const filteredMedia = mediaList.filter((media) => {
    // 如果有可用ID限制，只显示这些媒体
    if (availableMediaIds && availableMediaIds.length > 0) {
      return availableMediaIds.includes(media.id);
    }
    // 过滤媒体类型（根据文件后缀）
    if (activeTab === "image") {
      return isImageFile(media.url);
    }
    return isVideoFile(media.url);
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

  // 视频悬停播放处理
  const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.play().catch((err) => console.error("视频播放错误:", err));
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <TooltipProvider>
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
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
                  onChange={(v) => {
                    setInternalCategory(v || "");
                    setPage(1);
                  }}
                  placeholder="全部分类"
                  value={internalCategory}
                />
              </div>

              <Tabs
                onValueChange={(v) => {
                  setActiveTab(v as "image" | "video");
                  setPage(1);
                }}
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
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground text-sm">加载中...</p>
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
                    const video = isVideoFile(media.url);

                    return (
                      <Tooltip key={media.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${
                              isSelected
                                ? "border-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => toggleSelect(media.id)}
                          >
                            {video ? (
                              <video
                                className="h-full w-full object-cover"
                                muted
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                playsInline
                                src={media.url}
                              />
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
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs break-all">
                            {media.originalName}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 固定底部：选择提示和按钮 */}
          <div className="space-y-3 border-t px-6 py-4">
            {/* 分页信息 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <span>
                  共 {total} 个文件，第 {page} / {totalPages} 页
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage(page - 1)}
                    size="sm"
                    variant="outline"
                  >
                    <ChevronLeft className="mr-1 h-3 w-3" />
                    上一页
                  </Button>
                  <Button
                    disabled={page === totalPages || isLoading}
                    onClick={() => setPage(page + 1)}
                    size="sm"
                    variant="outline"
                  >
                    下一页
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

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
    </TooltipProvider>
  );
}
