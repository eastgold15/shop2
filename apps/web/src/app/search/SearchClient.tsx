"use client";

import { useEffect, useState } from "react";
import CategoryGrid from "@/components/layout/CategoryGrid";
import { useProductList } from "@/hooks/api/product-hook";

interface SearchClientProps {
  query?: string;
}

export default function SearchClient({ query }: SearchClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: productListRes,
    isLoading,
    error,
  } = useProductList({ name: query || "" }, { enabled: isMounted && !!query });

  if (!isMounted || isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-serif text-3xl italic">搜索出错</h1>
          <p className="text-gray-500">请稍后再试</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-serif text-3xl italic">请输入搜索关键词</h1>
          <p className="text-gray-500">在上方搜索框中输入商品名称</p>
        </div>
      </div>
    );
  }

  const hasResults = productListRes?.items.length ?? 0;

  return (
    <CategoryGrid
      description={
        hasResults > 0
          ? `找到 ${hasResults} 个相关商品`
          : `没有找到包含 "${query}" 的商品`
      }
      productListRes={
        productListRes || {
          items: [],
          meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
        }
      }
      title={`搜索: "${query}"`}
    />
  );
}
