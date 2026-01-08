"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentMediaQuery } from "@/hooks/api/meida-hook";
import { cn } from "@/lib/utils";

interface ImageProps {
  imageId: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  defaultImage?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop";

const DEFAULT_SIZES = "(max-width: 768px) 100vw, 80vw";

/**
 * 统一的图片组件
 *
 * 功能特性：
 * - 自动从 media API 获取图片 URL
 * - 支持骨架屏加载效果
 * - 支持优先加载控制（用于首屏图片）
 * - 支持自定义兜底图
 * - 支持响应式 sizes 配置
 *
 * @example
 * ```tsx
 * // 基本用法
 * <Image imageId="xxx" alt="产品图片" />
 *
 * // 首屏优先加载
 * <Image imageId="xxx" alt="首屏图片" priority />
 *
 * // 自定义兜底图
 * <Image imageId="xxx" alt="产品图片" defaultImage="/placeholder.jpg" />
 * ```
 */
export const ImageComponent: React.FC<ImageProps> = ({
  imageId,
  alt,
  className,
  priority = false,
  sizes = DEFAULT_SIZES,
  defaultImage = DEFAULT_IMAGE,
  fill = true,
  width,
  height,
}) => {
  const [isImgLoading, setIsImgLoading] = useState(true);

  // 确保传入字符串，避免 hook 报错
  const { data: imageUrl, isLoading: isQueryLoading } = useCurrentMediaQuery(
    String(imageId || "")
  );

  const finalSrc = imageUrl || defaultImage;

  // 判断是否需要显示骨架屏
  // 逻辑：正在查API 或 API查完了但图片文件还没下载完
  const showSkeleton = isQueryLoading || isImgLoading;

  // 如果不使用 fill 模式，必须提供 width 和 height
  const imageProps = fill
    ? { fill: true as const }
    : {
        width: width!,
        height: height!,
      };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showSkeleton && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full bg-gray-200" />
      )}

      <Image
        alt={alt}
        className={cn(
          "object-cover transition-opacity duration-700",
          // 图片加载好之前透明，避免看到"逐行扫描"的加载过程
          isImgLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsImgLoading(false)}
        priority={priority}
        sizes={sizes}
        src={finalSrc}
        {...imageProps}
      />
    </div>
  );
};

export default ImageComponent;
