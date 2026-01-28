"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BaseImageProps {
  imageUrl: string | null | undefined;
  alt?: string;
  className?: string;
  containerClassName?: string;
  defaultImage?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  unoptimized?: boolean; // 新增：允许手动控制优化
}

export const BaseImage: React.FC<BaseImageProps> = ({
  width,
  height,
  imageUrl,
  className,
  containerClassName,
  alt = "Image",
  defaultImage,
  priority = false,
  sizes = "(max-width: 768px) 50vw, 33vw",
  // 默认为 true，解决之前的 504 超时问题，直接让浏览器加载原图
  unoptimized = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  // 兜底图片逻辑
  const fallbackUrl =
    defaultImage ||
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop";

  // 计算最终显示的 Src
  // 如果没有 imageUrl 或者已经报错，就用兜底图；否则用原图
  const finalSrc = hasError || !imageUrl ? fallbackUrl : imageUrl;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-gray-50",
        containerClassName
      )}
    >
      {/* 2. 骨架屏逻辑：只要没加载完 (isLoaded 为 false)，就一直盖在上面 */}
      {!isLoaded && (
        <Skeleton className="absolute inset-0 z-20 h-full w-full animate-pulse bg-gray-200" />
      )}

      {/* 3. 图片组件 */}
      <Image
        alt={alt}
        className={cn(
          "object-cover transition-all duration-500 ease-in-out",
          className,
          isLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
        )}
        fill
        onError={() => {
          // 图片加载失败，触发重新渲染使用 fallbackUrl
          setHasError(true);
          setIsLoaded(false); // 重置为未加载，让 Image 组件去加载 fallbackUrl 并触发新的 onLoad
        }}
        onLoad={() => {
          setIsLoaded(true);
        }}
        // 关键：绕过 Next.js 服务器优化，直接由浏览器请求图片，解决加载卡顿/超时
        priority={priority}
        sizes={sizes}
        src={finalSrc}
        unoptimized={unoptimized}
      />
    </div>
  );
};
