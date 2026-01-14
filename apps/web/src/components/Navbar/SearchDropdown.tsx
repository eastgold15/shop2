"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useProductList } from "@/hooks/api/product-hook";
import ProductCard from "../product/productCard";

export const SearchDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productListRes, isLoading } = useProductList(
    { name: searchQuery, limit: 8 },
    { enabled: searchQuery.length >= 2 }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-black transition-colors hover:text-gray-500">
        <Search className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 w-96 overflow-hidden rounded border border-gray-200 bg-white shadow-xl">
          <div className="border-gray-200 border-b p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                className="w-full rounded border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-black focus:outline-none"
                onChange={handleSearchChange}
                placeholder="搜索商品..."
                type="text"
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse text-gray-400">搜索中...</div>
              </div>
            ) : searchQuery.length >= 2 ? (
              productListRes && productListRes.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {productListRes.items.map((product) => (
                    <ProductCard
                      key={product.siteProductId}
                      product={product}
                    />
                  ))}
                  {productListRes.items.length > 0 && (
                    <Link
                      className="col-span-2 mt-4 flex justify-center"
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <button className="border-black border-b pb-1 font-bold text-xs uppercase tracking-[0.2em] transition-colors hover:border-gray-500 hover:text-gray-500">
                        查看全部结果
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">未找到相关商品</p>
                </div>
              )
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">
                  请输入至少2个字符进行搜索
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
