"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageItem {
  id: string;
  url: string;
  isMain?: boolean;
  originalName?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg" | "fill";
  title?: string;
  onPreview?: (url: string) => void;
  className?: string;
  /** 是否直接显示全屏预览（已废弃，保留兼容性） */
  showPreviewOnly?: boolean;
  /** 当只有1张图片时，是否显示为单图模式（默认 true） */
  autoSingleMode?: boolean;
  /** 强制使用单图模式，不管图片数量 */
  forceSingleMode?: boolean;
}

const sizeConfig = {
  sm: { size: "h-12 w-12", sizes: "48px" },
  md: { size: "h-16 w-16", sizes: "64px" },
  lg: { size: "h-20 w-20", sizes: "80px" },
  fill: { size: "h-full w-full", sizes: "100vw" },
};

export function ImageGallery({
  images,
  maxDisplay = 6,
  size = "sm",
  title,
  onPreview,
  className = "",
  showPreviewOnly = false,
  autoSingleMode = true,
  forceSingleMode = false,
}: ImageGalleryProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const handlePreview = (url: string) => {
    const index = images.findIndex((img) => img.url === url);
    setCurrentIndex(index >= 0 ? index : 0);
    setPreviewUrl(url);
    setScale(1);
    onPreview?.(url);
  };

  const config = sizeConfig[size];
  const displayImages =
    Array.isArray(images) && images.length > 0
      ? images.slice(0, maxDisplay)
      : [];
  const remainingCount = Array.isArray(images)
    ? Math.max(0, images.length - maxDisplay)
    : 0;

  const isSingleMode =
    forceSingleMode || (autoSingleMode && images.length === 1);

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setPreviewUrl(images[newIndex].url);
    setScale(1);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setPreviewUrl(images[newIndex].url);
    setScale(1);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    if (previewUrl) {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = `image-${currentIndex + 1}`;
      link.target = "_blank";
      link.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setPreviewUrl(null);
    } else if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  return (
    <>
      {!showPreviewOnly && displayImages.length > 0 && (
        <>
          {!isSingleMode && title && (
            <p className="mb-2 font-medium text-slate-700 text-xs uppercase tracking-wide">
              {title} ({images.length})
            </p>
          )}
          <div
            className={
              isSingleMode
                ? `h-full w-full ${className}`
                : `flex items-center gap-2 overflow-x-auto ${className}`
            }
          >
            {displayImages.map((image, idx) => (
              <div
                className={`${config.size} relative ${isSingleMode ? "" : "shrink-0"} cursor-pointer overflow-hidden rounded-lg border-2 bg-white shadow-sm transition-all hover:scale-105 hover:shadow-md`}
                key={image.id}
                onClick={() => handlePreview(image.url)}
                style={{
                  borderColor: image.isMain
                    ? "rgb(99 102 241)"
                    : "rgb(226 232 240)",
                }}
              >
                <Image
                  alt={image.originalName || "图片"}
                  className="h-full w-full object-cover"
                  fill
                  key={image.id + image.url}
                  sizes={config.sizes}
                  src={image.url}
                  unoptimized
                />
                {!isSingleMode && image.isMain && (
                  <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs shadow-sm">
                    ★
                  </div>
                )}
              </div>
            ))}
            {!isSingleMode && remainingCount > 0 && (
              <span className="flex h-16 w-8 items-center justify-center rounded border border-slate-300 border-dashed bg-slate-50 text-slate-500 text-xs">
                +{remainingCount}
              </span>
            )}
          </div>
        </>
      )}

      {/* 图片预览 */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewUrl(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* 顶部工具栏 */}
          <div
            className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between border-white/10 border-b bg-black/50 px-6 py-4 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-white">
              <span className="font-semibold text-sm">
                {currentIndex + 1} / {images.length}
              </span>
              {title && (
                <span className="text-slate-400 text-xs">· {title}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20"
                onClick={handleZoomOut}
                title="缩小"
                type="button"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20"
                onClick={handleZoomIn}
                title="放大"
                type="button"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20"
                onClick={handleDownload}
                title="下载"
                type="button"
              >
                <Download className="h-4 w-4" />
              </button>
              <div className="mx-2 h-6 w-px bg-white/20" />
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-red-500/50"
                onClick={() => setPreviewUrl(null)}
                title="关闭 (ESC)"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 左右切换按钮 */}
          {images.length > 1 && (
            <>
              <button
                className="fixed top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white/20"
                onClick={handlePrev}
                title="上一张 (←)"
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="fixed top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white/20"
                onClick={handleNext}
                title="下一张 (→)"
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* 图片容器 */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.2s",
            }}
          >
            <div className="relative max-h-[80vh] max-w-[90vw]">
              <Image
                alt="预览图片"
                className="max-h-[80vh] max-w-[90vw] object-contain shadow-2xl"
                height={1200}
                src={previewUrl}
                unoptimized
                width={1200}
              />
            </div>
          </div>

          {/* 底部缩略图 */}
          {images.length > 1 && (
            <div
              className="fixed right-0 bottom-0 left-0 z-10 border-white/10 border-t bg-black/50 px-6 py-4 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                      idx === currentIndex
                        ? "border-indigo-500 shadow-indigo-500/50 shadow-lg"
                        : "border-white/20 hover:border-white/40"
                    }`}
                    key={img.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setPreviewUrl(img.url);
                      setScale(1);
                    }}
                    type="button"
                  >
                    <Image
                      alt={img.originalName || `图片 ${idx + 1}`}
                      className="h-full w-full object-cover"
                      fill
                      key={img.id + img.url}
                      sizes="64px"
                      src={img.url}
                      unoptimized
                    />
                    {idx === currentIndex && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 快捷键提示 */}
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white/70 text-xs backdrop-blur-sm">
            <span className="mr-3">ESC 关闭</span>
            <span className="mr-3">← → 切换</span>
            <span>滚轮缩放</span>
          </div>
        </div>
      )}
    </>
  );
}
