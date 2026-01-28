"use client";

import { AlertCircle, ImageIcon } from "lucide-react"; // 假设你使用 lucide-react，用于显示错误图标，可选
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentMediaDetail } from "@/hooks/api/meida-hook"; // 修正了原本拼写错误的 meida-hook
import { cn } from "@/lib/utils";

interface ImageProps {
  imageId?: string | null | undefined;
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: string;
  hoverSrc?: string;
  showSkeleton?: boolean;
  /** 图片加载失败时是否保持骨架屏，默认为 false (显示错误图标) */
  keepSkeletonOnError?: boolean;
}

const DEFAULT_SIZES = "(max-width: 768px) 100vw, 80vw";

export const ImageComponent: React.FC<ImageProps> = ({
  imageId,
  src,
  alt,
  className,
  priority = false,
  sizes = DEFAULT_SIZES,
  fill = true,
  width,
  height,
  aspectRatio,
  hoverSrc,
  showSkeleton = true,
  keepSkeletonOnError = false,
}) => {
  // 状态管理：加载中、出错
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 仅当没有直接提供 src 且有 imageId 时才调用 hook
  const shouldFetch = !src && !!imageId;
  const { data: remoteUrl, isLoading: isQueryLoading } = useCurrentMediaDetail(
    shouldFetch ? imageId! : ""
  );

  // 计算最终使用的图片地址 (src 优先级高于 API 获取的 remoteUrl)
  const finalSrc = src || remoteUrl;

  // 判定是否显示骨架屏：
  // 1. 显式要求显示
  // 2. API 正在查询中
  // 3. 图片正在加载中 (且未出错)
  // 4. (可选) 出错时保持骨架屏
  const shouldShowSkeleton =
    showSkeleton &&
    (isQueryLoading ||
      (isImgLoading && !isError) ||
      (isError && keepSkeletonOnError));

  // 尺寸属性处理
  const imageProps = fill
    ? { fill: true as const }
    : { width: width ?? 500, height: height ?? 300 }; // 给定默认宽高防止报错

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-50",
        className,
        aspectRatio
      )}
    >
      {/* --- 1. 骨架屏层 --- */}
      {shouldShowSkeleton && (
        <Skeleton className="absolute inset-0 z-20 h-full w-full animate-pulse bg-muted/60" />
      )}

      {/* --- 2. 错误/空状态层 (当加载失败且不保留骨架屏时显示) --- */}
      {isError && !keepSkeletonOnError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <AlertCircle className="mb-2 h-8 w-8 opacity-50" />
          <span className="text-xs">加载失败</span>
        </div>
      )}

      {/* 同样处理：如果没有 src 也没有 API 数据，且不在加载 API 中，显示占位 */}
      {!(finalSrc || isQueryLoading || isError) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 text-gray-400">
          <ImageIcon className="h-8 w-8 opacity-50" />
        </div>
      )}

      {/* --- 3. 主图片层 --- */}
      {finalSrc && (
        <Image
          alt={alt}
          className={cn(
            "object-cover transition-all duration-700",
            // 加载完成前透明，防止显示浏览器默认的断图图标或逐行加载
            isImgLoading || isError ? "opacity-0" : "opacity-100"
          )}
          onError={() => {
            setIsImgLoading(false);
            setIsError(true);
          }}
          onLoad={() => setIsImgLoading(false)}
          priority={priority}
          sizes={sizes}
          src={finalSrc}
          {...imageProps}
        />
      )}

      {/* --- 4. 悬停图片层 (可选) --- */}
      {hoverSrc && !isError && !isImgLoading && (
        <Image
          alt={`${alt} - hover`}
          className={cn(
            "absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            // 确保它位于主图之上
            "z-10"
          )}
          priority={priority}
          sizes={sizes} // 悬停图通常不需要 priority，除非很重要
          src={hoverSrc}
          {...imageProps}
        />
      )}
    </div>
  );
};

export default ImageComponent;
