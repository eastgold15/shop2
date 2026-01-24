"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BaseImageProps {
  imageUrl: string | null | undefined;
  alt?: string;
  className?: string; // 作用于 Image 标签，处理 object-fit 等
  containerClassName?: string; // 作用于最外层容器，处理背景、宽高、圆角
  defaultImage?: string;
  priority?: boolean; // 是否优先加载（首屏图片需设为 true）
  sizes?: string;
}

/**
 * 强化版 Product 图片组件
 */
export const BaseImage: React.FC<BaseImageProps> = ({
  imageUrl,
  className,
  containerClassName,
  alt = "Image",
  defaultImage,
  priority = false,
  sizes = "(max-width: 768px) 50vw, 33vw",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const fallbackUrl =
    defaultImage ||
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop";

  // 最终显示的图片源
  const finalSrc = error || !imageUrl ? fallbackUrl : imageUrl;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-white", // 默认背景和溢出隐藏
        containerClassName
      )}
    >
      {/* 加载状态控制：只有未加载完成且没有出错时显示 Skeleton */}
      {!isLoaded && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full" />
      )}

      <Image
        alt={alt}
        className={cn(
          "transition-all duration-500 ease-in-out",
          // 默认使用 object-cover 以占满容器，除非外部传入 object-contain
          className || "object-cover",
          isLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
        )}
        fill
        onError={() => setError(true)}
        onLoad={() => setIsLoaded(true)}
        priority={priority}
        sizes={sizes}
        src={finalSrc}
      />
    </div>
  );
};
