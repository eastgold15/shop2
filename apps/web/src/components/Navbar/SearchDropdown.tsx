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
        <div className="absolute right-0 top-full z-50 w-96 overflow-hidden rounded border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                className="w-full rounded border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-black focus:outline-none"
                placeholder="搜索商品..."
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  <p className="text-sm text-gray-500">未找到相关商品</p>
                </div>
              )
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">
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
