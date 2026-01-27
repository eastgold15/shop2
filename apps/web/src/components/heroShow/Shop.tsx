"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useSiteProductList } from "@/hooks/api/site-category";
import { BaseImage } from "../common/Image/baseImage";
import { Skeleton } from "../ui/skeleton";

interface ShopProps {
  onProductSelect?: (productId: string) => void;
}

const ShopSkeleton = () => (
  <div className="grid w-full max-w-2xl grid-cols-2 gap-x-8 gap-y-16">
    {Array.from({ length: 4 }).map((_, i) => (
      <div className="flex flex-col items-center" key={i}>
        {/* 匹配图片的 aspect-[4/3] */}
        <Skeleton className="mb-6 aspect-4/3 w-full" />
        {/* 匹配标题文字 */}
        <Skeleton className="h-6 w-24" />
      </div>
    ))}
  </div>
);

const Shop: React.FC<ShopProps> = ({ onProductSelect }) => {
  const router = useRouter();
  const { data, isLoading, error } = useSiteProductList({ limit: 4 });

  // 1. 优先处理加载
  if (isLoading) return <ShopSkeleton />;

  // 2. 错误处理 (建议不渲染任何内容或渲染一个简单的提示)
  if (error || !data) return null;

  const products = data.items || [];

  return (
    <div className="grid h-full w-full gap-x-8 gap-y-4 bg-white p-8 md:grid-cols-2">
      {products.slice(0, 4).map((product) => (
        <div
          className="group flex basis-100 cursor-pointer flex-col items-center"
          key={product.siteProductId}
          onClick={() => router.push(`/product/${product.siteProductId}`)}
        >
          <div className="relative mb-6 aspect-4/3 w-full overflow-hidden">
            <BaseImage
              alt={product.displayName}
              className="h-full w-full object-contain"
              imageUrl={product.mainMedia}
              key={product.mainMedia}
            />
          </div>
          <div className="text-center">
            <h3 className="mb-1 font-serif text-black text-lg italic transition-colors group-hover:text-gray-600 md:text-xl">
              {product.displayName}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shop;
