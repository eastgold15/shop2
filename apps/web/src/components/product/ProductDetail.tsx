"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Play,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useCreateInquiry } from "@/hooks/api/inquiry-hook";
import {
  type ProductDetailRes,
  useProductList,
} from "@/hooks/api/product-hook";
import { cn } from "@/lib/utils";
import { InquiryForm, type InquiryFormValues } from "./InquiryForm";
import { SuccessView } from "./SuccessView";

interface ProductDetailProps {
  siteProduct: ProductDetailRes; // 确保这个 Type 已经根据后端新结构更新
}

const PAYMENT_METHODS = [
  "Cash on Delivery",
  "30% Deposit, Balance against B/L",
  "L/C at 30 days sight",
];

const ProductDetail: React.FC<ProductDetailProps> = ({ siteProduct }) => {
  const [activeMedia, setActiveMedia] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "details">(
    "description"
  );

  // 1. 猜你喜欢逻辑适配
  const categoryId = siteProduct.categories?.[0]?.id;
  const { data: productList } = useProductList(
    { categoryId, limit: 4 },
    { enabled: !!categoryId }
  );

  const relatedProducts = useMemo(
    () =>
      productList?.items
        ?.filter((item) => item.siteProductId !== siteProduct.id)
        .slice(0, 3) || [],
    [productList, siteProduct.id]
  );

  // 2. 媒体库直接使用后端的 gallery (后端已排好序：SPU图片 > SKU图片 > 视频)
  const allMedia = siteProduct.gallery || [];

  // 3. SKU & 规格逻辑
  const skus = siteProduct.skus || [];
  const specOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};
    skus.forEach((sku) => {
      const specJson = (sku.specJson as Record<string, string>) || {};
      Object.entries(specJson).forEach(([key, value]) => {
        if (!options[key]) options[key] = new Set();
        options[key].add(value);
      });
    });
    return Object.fromEntries(
      Object.entries(options).map(([key, values]) => [key, Array.from(values)])
    );
  }, [skus]);

  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>(
    {}
  );

  const selectedSku = useMemo(() => {
    if (Object.keys(selectedSpecs).length === 0) return null;
    return skus.find((sku) => {
      const specJson = (sku.specJson as Record<string, string>) || {};
      return Object.entries(selectedSpecs).every(
        ([key, value]) => specJson[key] === value
      );
    });
  }, [skus, selectedSpecs]);

  const displayPrice = useMemo(() => {
    if (selectedSku) return Number(selectedSku.price);
    if (skus.length === 0) return 0;
    return Math.min(...skus.map((s) => Number(s.price)));
  }, [selectedSku, skus]);

  // 4. 核心联动修复：选中规格时，通过 mediaIds 定位 gallery 中的图片
  useEffect(() => {
    if (selectedSku && selectedSku.mediaIds?.length > 0) {
      const targetId = selectedSku.mediaIds[0];
      const index = allMedia.findIndex((m) => m.id === targetId);
      if (index !== -1) {
        setActiveMedia(index);
      }
    }
  }, [selectedSku, allMedia]);

  // 5. 表单提交逻辑
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[1]);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const inquiryMutation = useCreateInquiry();

  const handleInquirySubmit = async (values: InquiryFormValues) => {
    try {
      if (!selectedSku) return alert("Please select a product variant first");

      const { remarks, ...contactInfo } = values;
      localStorage.setItem("gina_user_info", JSON.stringify(contactInfo));

      await inquiryMutation.mutateAsync({
        siteProductId: siteProduct.id,
        siteSkuId: selectedSku.id,
        skuMediaId: selectedSku.mediaIds?.[0] || "",
        productName: siteProduct.name,
        productDesc: siteProduct.description || "",
        paymentMethod,
        customerRemarks: remarks || "",
        quantity,
        customerCompany: values.company,
        customerEmail: values.email || "",
        customerPhone: values.phone || "",
        customerWhatsapp: values.whatsapp || "",
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowInquiryForm(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const getSavedValues = () => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("gina_user_info");
    return saved ? JSON.parse(saved) : {};
  };

  const handleOpenInquiry = () => {
    if (Object.keys(specOptions).length > 0) {
      const missing = Object.keys(specOptions).filter((k) => !selectedSpecs[k]);
      if (missing.length > 0)
        return alert(`Please select: ${missing.join(", ")}`);
    }
    if (skus.length > 0 && !selectedSku)
      return alert("Invalid combination selected");
    setShowInquiryForm(true);
  };

  const mediaItem = allMedia[activeMedia];

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="mx-auto max-w-325 px-6">
        <div className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* --- LEFT: GALLERY --- */}
          <div className="flex flex-col items-center lg:col-span-7">
            <div className="group relative mb-8 aspect-4/3 w-full overflow-hidden bg-gray-50">
              {allMedia.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-0 z-10 -translate-y-1/2 p-4 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      setActiveMedia(
                        (p) => (p - 1 + allMedia.length) % allMedia.length
                      )
                    }
                  >
                    <ChevronLeft className="h-8 w-8 text-gray-400 hover:text-black" />
                  </button>
                  <button
                    className="absolute top-1/2 right-0 z-10 -translate-y-1/2 p-4 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      setActiveMedia((p) => (p + 1) % allMedia.length)
                    }
                  >
                    <ChevronRight className="h-8 w-8 text-gray-400 hover:text-black" />
                  </button>
                </>
              )}

              {mediaItem ? (
                mediaItem.mediaType?.startsWith("video") ? (
                  <video
                    autoPlay
                    className="h-full w-full object-contain mix-blend-multiply"
                    controls
                    key={mediaItem.id}
                    loop
                    muted
                  >
                    <source src={mediaItem.url} />
                  </video>
                ) : (
                  <Image
                    alt={siteProduct.name}
                    className="object-contain mix-blend-multiply"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    src={mediaItem.url}
                  />
                )
              ) : null}
            </div>

            {/* Thumbnails */}
            <div className="no-scrollbar flex max-w-full space-x-4 overflow-x-auto pb-2">
              {allMedia.map((m, idx) => (
                <button
                  className={cn(
                    "relative h-20 w-20 shrink-0 border transition-all",
                    activeMedia === idx
                      ? "border-black ring-1 ring-black"
                      : "border-gray-100"
                  )}
                  key={m.id}
                  onClick={() => setActiveMedia(idx)}
                >
                  {m.mediaType?.startsWith("video") ? (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <Play className="h-6 w-6 text-gray-400" />
                    </div>
                  ) : (
                    <Image alt="" className="object-cover" fill src={m.url} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: INFO --- */}
          <div className="pt-8 pl-4 lg:col-span-5">
            <h1 className="mb-2 font-serif text-5xl text-black italic leading-tight">
              {siteProduct.name}
            </h1>
            <p className="mb-6 font-serif text-gray-500 text-xl italic">
              {siteProduct.spuCode}
            </p>

            <div className="mb-8 font-light text-lg">
              Ref Price:{" "}
              <span className="font-medium text-black">
                {displayPrice > 0
                  ? `USD ${displayPrice.toFixed(2)}`
                  : "Contact for price"}
                {!selectedSku && skus.length > 1 && (
                  <span className="ml-1 text-gray-400 text-sm">起</span>
                )}
              </span>
            </div>

            {/* 规格选择器 */}
            {Object.entries(specOptions).map(([key, values]) => (
              <div className="mb-6" key={key}>
                <span className="mb-2 block font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                  {key}
                </span>
                <div className="flex flex-wrap gap-2">
                  {values.map((val) => (
                    <button
                      className={cn(
                        "border px-4 py-2 font-bold text-xs transition-colors",
                        selectedSpecs[key] === val
                          ? "border-black bg-black text-white"
                          : "border-gray-200 text-black hover:border-black"
                      )}
                      key={val}
                      onClick={() => {
                        // 1. 设置选中状态
                        setSelectedSpecs((prev) => ({ ...prev, [key]: val }));

                        // 2. 立即寻找带有所选规格的第一张图片进行跳转（模糊匹配）
                        const firstMatchingSku = skus.find((sku) => {
                          const specJson =
                            (sku.specJson as Record<string, string>) || {};
                          return specJson[key] === val;
                        });

                        if (
                          firstMatchingSku &&
                          firstMatchingSku.mediaIds?.length > 0
                        ) {
                          const targetId = firstMatchingSku.mediaIds[0];
                          const mediaIndex = allMedia.findIndex(
                            (m) => m.id === targetId
                          );
                          if (mediaIndex !== -1) {
                            setActiveMedia(mediaIndex);
                          }
                        }
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* 数量与支付方式 */}
            <div className="mb-8 space-y-6">
              <div>
                <span className="mb-2 block font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                  Quantity
                </span>
                <div className="flex w-32 items-center border border-gray-200">
                  <button
                    className="flex h-10 w-10 items-center justify-center hover:bg-gray-50"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <div className="flex-1 text-center font-medium text-sm">
                    {quantity}
                  </div>
                  <button
                    className="flex h-10 w-10 items-center justify-center hover:bg-gray-50"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="mb-2 block font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                  Payment Terms
                </span>
                <select
                  className="w-full appearance-none border border-gray-200 bg-white px-4 py-3 pr-10 font-serif text-sm italic focus:border-black focus:outline-none"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 bottom-3.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <button
              className="w-full bg-black py-4 font-bold text-[11px] text-white uppercase tracking-[0.2em] transition-colors hover:bg-gray-800"
              onClick={handleOpenInquiry}
            >
              Request Availability
            </button>
          </div>
        </div>

        {/* 详情 Tabs */}
        <div className="border-gray-200 border-t pt-12">
          <div className="mb-8 flex space-x-8 border-gray-100 border-b">
            {["description", "details"].map((tab) => (
              <button
                className={cn(
                  "pb-4 font-bold text-xs uppercase tracking-widest transition-colors",
                  activeTab === tab
                    ? "border-black border-b-2 text-black"
                    : "text-gray-400"
                )}
                key={tab}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="font-serif text-gray-600 leading-relaxed">
            {activeTab === "description" ? (
              <div style={{ whiteSpace: "pre-line" }}>
                {siteProduct.description}
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  <span className="mr-4 font-bold font-sans text-[10px] uppercase">
                    SPU Code
                  </span>{" "}
                  {siteProduct.spuCode}
                </p>
                <p>
                  <span className="mr-4 font-bold font-sans text-[10px] uppercase">
                    Categories
                  </span>{" "}
                  {siteProduct.categories?.map((c) => c.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 询盘 Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="no-scrollbar relative max-h-[90vh] w-full max-w-md overflow-y-auto bg-white p-8 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
              onClick={() => setShowInquiryForm(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6 text-center">
              <h3 className="mb-2 font-serif text-3xl italic">Request Quote</h3>
              <p className="text-gray-500 text-xs">{siteProduct.name}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {Object.entries(selectedSpecs).map(([k, v]) => (
                  <span
                    className="border border-gray-200 bg-gray-100 px-2 py-1 font-bold text-[10px] text-gray-600 uppercase"
                    key={k}
                  >
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
            {submitSuccess ? (
              <SuccessView />
            ) : (
              <InquiryForm
                defaultValues={getSavedValues()}
                onSubmit={handleInquirySubmit}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
