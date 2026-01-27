"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Palette } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MediaSelect } from "@/components/ui/media-select";
import {
  useProductVariantMedia,
  useSetProductVariantMedia,
} from "@/hooks/api/product-variant";
import { isVideoFile } from "@/utils/media";

const formSchema = z.object({
  variantMedia: z.array(
    z.object({
      attributeValueId: z.string(),
      mediaIds: z.array(z.string()),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

interface VariantMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  productId: string;
}

export function VariantMediaModal({
  open,
  onOpenChange,
  onSuccess,
  productId,
}: VariantMediaModalProps) {
  const { data, isLoading, refetch } = useProductVariantMedia(
    open ? productId : undefined
  );
  const setVariantMedia = useSetProductVariantMedia();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variantMedia: [],
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        variantMedia: data.variantMedia.map((vm) => ({
          attributeValueId: vm.attributeValueId,
          mediaIds: vm.images.map((img) => img.id),
        })),
      });
    }
  }, [data, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await setVariantMedia.mutateAsync({
        productId,
        variantMedia: data.variantMedia,
      });
      onSuccess?.();
      onOpenChange(false);
      refetch();
    } catch (error) {
      console.error("保存失败:", error);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    // 🔥 移除 form.reset()，避免干扰 useEffect 的数据加载
    // useEffect 会在 data 变化时自动处理重置
    onOpenChange(isOpen);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-600" />
            管理变体图片
          </DialogTitle>
          <DialogDescription>
            为不同颜色属性值配置专属图片，避免为每个 SKU 重复上传
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : data && data.variantMedia.length > 0 ? (
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {data.variantMedia.map((vm, index) => (
                <div
                  className="rounded-lg border p-4"
                  key={vm.attributeValueId}
                >
                  <h3 className="mb-4 font-semibold">
                    {data.colorAttributeKey}: {vm.attributeValue}
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`variantMedia.${index}.mediaIds`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>选择图片（第一张自动作为主图）</FormLabel>
                          <FormControl>
                            <MediaSelect
                              max={5}
                              multiple
                              onChange={field.onChange}
                              value={field.value || []}
                            />
                          </FormControl>
                          <p className="text-[10px] text-slate-400">
                            💡 第一张图片将自动作为主图显示
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 图片预览 */}
                    {form.watch(`variantMedia.${index}.mediaIds`)?.length >
                      0 && (
                      <div className="flex flex-wrap gap-2">
                        {form
                          .watch(`variantMedia.${index}.mediaIds`)
                          ?.map((mediaId, imgIndex) => {
                            const media = vm.images.find(
                              (img) => img.id === mediaId
                            );
                            return media ? (
                              <div
                                className="relative h-20 w-20 overflow-hidden rounded-md border"
                                key={mediaId}
                              >
                                {/* 根据文件后缀判断是视频还是图片 */}
                                {isVideoFile(media.url) ? (
                                  <video
                                    className="h-full w-full object-cover"
                                    muted
                                    onMouseEnter={(e) => {
                                      const video = e.currentTarget;
                                      video.play().catch(() => {});
                                    }}
                                    onMouseLeave={(e) => {
                                      const video = e.currentTarget;
                                      video.pause();
                                      video.currentTime = 0;
                                    }}
                                    playsInline
                                    src={media.url}
                                  />
                                ) : (
                                  <img
                                    alt={vm.attributeValue}
                                    className="h-full w-full object-cover"
                                    src={media.url}
                                  />
                                )}
                                {/* 媒体类型标签 */}
                                {isVideoFile(media.url) && (
                                  <span className="absolute top-0 left-0 rounded-br bg-blue-600 px-1 text-[10px] text-white">
                                    视频
                                  </span>
                                )}
                                {/* 🔥 第一张图标记为主图 */}
                                {imgIndex === 0 && (
                                  <span className="absolute top-0 right-0 rounded-bl bg-indigo-600 px-1 text-[10px] text-white">
                                    主图
                                  </span>
                                )}
                              </div>
                            ) : null;
                          })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <DialogFooter>
                <Button
                  onClick={() => onOpenChange(false)}
                  type="button"
                  variant="outline"
                >
                  取消
                </Button>
                <Button disabled={setVariantMedia.isPending} type="submit">
                  {setVariantMedia.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    "保存配置"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Palette className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="mb-2 font-semibold text-slate-900">
              该商品没有配置颜色属性
            </h3>
            <p className="text-center text-slate-500">
              请确保商品模板包含颜色规格属性（属性名包含
              &quot;Color&quot;、&quot;颜色&quot; 或 &quot;colour&quot;）
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
