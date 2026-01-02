"use client";

import {
  ArrowDown,
  ArrowUp,
  FolderOpen,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MasterCategorySelect } from "@/components/ui/master-category-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SiteCategoryTreeSelect } from "@/components/ui/site-category-tree-select";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/api/template";

// 辅助函数
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");

interface TemplateField {
  id: string;
  key: string; // 显示名称 (如: "颜色")
  code: string; // API代码 (如: "color")
  inputType: "text" | "number" | "select" | "multiselect";
  value?: string; // 占位符内容
  options?: string[]; // 选项列表 (用于 select/multiselect)
  isRequired: boolean;
  isSkuSpec: boolean;
}

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editingTemplate?: any;
}

export function CreateTemplateModal({
  open,
  onOpenChange,
  onSuccess,
  editingTemplate,
}: CreateTemplateModalProps) {
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  const isEdit = !!editingTemplate;

  // 表单状态
  const [name, setName] = useState("");
  const [masterCategoryId, setMasterCategoryId] = useState("");
  const [siteCategoryId, setSiteCategoryId] = useState("");
  const [fields, setFields] = useState<TemplateField[]>([]);

  // 初始化/重置表单
  const resetForm = useCallback((data?: any) => {
    setName(data?.name || "");
    setMasterCategoryId(data?.masterCategoryId || "");
    setSiteCategoryId(data?.siteCategoryId || "");
    setFields(data?.fields || []);
  }, []);

  // 当编辑的模版变化时，重置表单
  useEffect(() => {
    if (editingTemplate) {
      resetForm(editingTemplate);
    } else {
      resetForm();
    }
  }, [editingTemplate, resetForm]);

  // 添加字段
  const addField = useCallback(() => {
    const id = Date.now().toString();
    setFields((prev) => [
      ...prev,
      {
        id,
        key: "",
        code: `field_${id.slice(-4)}`,
        inputType: "text",
        isRequired: false,
        isSkuSpec: false,
        value: "",
      },
    ]);
  }, []);

  // 更新字段
  const updateField = useCallback(
    (id: string, updates: Partial<TemplateField>) => {
      setFields((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  // 移动字段
  const moveField = useCallback((index: number, direction: "up" | "down") => {
    setFields((prev) => {
      const newFields = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newFields.length) return prev;
      [newFields[index], newFields[targetIndex]] = [
        newFields[targetIndex],
        newFields[index],
      ];
      return newFields;
    });
  }, []);

  // 移除字段
  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // 验证表单
  const isValid = useMemo(
    () =>
      name.trim() !== "" &&
      masterCategoryId !== "" &&
      fields.length > 0 &&
      fields.every((f) => f.key.trim() !== ""),
    [name, masterCategoryId, fields]
  );

  // 提交表单
  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("请填写所有必填字段并至少添加一个字段定义");
      return;
    }

    try {
      const submitData: any = {
        name: name.trim(),
        masterCategoryId,
      };

      if (siteCategoryId) {
        submitData.siteCategoryId = siteCategoryId;
      }

      submitData.fields = fields.map((f) => ({
        key: f.key,
        inputType: f.inputType,
        isRequired: f.isRequired,
        isSkuSpec: f.isSkuSpec,
        ...(f.value && { value: f.value }),
        ...(f.options && f.options.length > 0 && { options: f.options }),
      }));

      if (isEdit) {
        await updateMutation.mutateAsync({
          id: editingTemplate.id,
          data: submitData,
        });
        toast.success("模版更新成功");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("模版创建成功");
      }

      onSuccess?.();
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "操作失败");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {isEdit ? "编辑商品模版" : "创建商品模版"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "修改商品模版的字段定义和配置"
              : "创建新的商品模版，定义商品的属性字段"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* 基础配置 */}
          <div className="space-y-4 py-4">
            <h3 className="font-semibold text-lg">基础配置</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">
                  模版名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：电子产品标准模版"
                  value={name}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  主分类 <span className="text-red-500">*</span>
                </Label>
                <MasterCategorySelect
                  onChange={setMasterCategoryId}
                  placeholder="选择主分类"
                  value={masterCategoryId}
                />
              </div>

              <div className="space-y-2">
                <Label>站点分类</Label>
                <SiteCategoryTreeSelect
                  onChange={setSiteCategoryId}
                  placeholder="选择站点分类（可选）"
                  value={siteCategoryId}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 字段定义 */}
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">字段定义</h3>
              <Button
                onClick={addField}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="mr-1 h-4 w-4" />
                添加字段
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed py-10 text-center">
                <p className="text-slate-400">
                  暂无字段，点击"添加字段"开始定义
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FieldItem
                    field={field}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === fields.length - 1}
                    key={field.id}
                    onMove={moveField}
                    onRemove={removeField}
                    onUpdate={updateField}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            取消
          </Button>
          <Button disabled={!isValid || isLoading} onClick={handleSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "保存中..." : "创建中..."}
              </>
            ) : (
              <>
                <Save className="mr-1 h-4 w-4" />
                {isEdit ? "保存修改" : "创建模版"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 字段项组件
interface FieldItemProps {
  field: TemplateField;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (id: string, updates: Partial<TemplateField>) => void;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}

function FieldItem({
  field,
  index,
  onUpdate,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: FieldItemProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">
          字段 #{index + 1}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:text-indigo-600 disabled:opacity-20"
            disabled={isFirst}
            onClick={() => onMove(index, "up")}
            type="button"
          >
            <ArrowUp size={14} />
          </button>
          <button
            className="p-1 hover:text-indigo-600 disabled:opacity-20"
            disabled={isLast}
            onClick={() => onMove(index, "down")}
            type="button"
          >
            <ArrowDown size={14} />
          </button>
          <button
            className="ml-2 p-1 text-slate-400 hover:text-red-500"
            onClick={() => onRemove(field.id)}
            type="button"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 space-y-2">
          <Label className="font-bold text-xs uppercase">显示名称</Label>
          <Input
            onChange={(e) =>
              onUpdate(field.id, {
                key: e.target.value,
                code: slugify(e.target.value),
              })
            }
            placeholder="例如：颜色"
            value={field.key}
          />
        </div>

        <div className="col-span-4 space-y-2">
          <Label className="font-bold text-xs uppercase">API 代码</Label>
          <div className="flex h-9 items-center rounded border bg-slate-100 px-3 font-mono text-slate-500 text-xs">
            {field.code}
          </div>
        </div>

        <div className="col-span-4 space-y-2">
          <Label className="font-bold text-xs uppercase">输入类型</Label>
          <Select
            onValueChange={(value: any) =>
              onUpdate(field.id, { inputType: value })
            }
            value={field.inputType}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">文本输入</SelectItem>
              <SelectItem value="number">数字</SelectItem>
              <SelectItem value="select">下拉选择</SelectItem>
              <SelectItem value="multiselect">多选下拉</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-12 space-y-2">
          {field.inputType === "text" || field.inputType === "number" ? (
            <>
              <Label className="font-bold text-xs uppercase">占位符内容</Label>
              <Input
                onChange={(e) => onUpdate(field.id, { value: e.target.value })}
                placeholder="例如：请输入产品尺寸"
                value={field.value || ""}
              />
            </>
          ) : (
            <>
              <Label className="font-bold text-xs uppercase">
                选项（逗号分隔）
              </Label>
              <Input
                onChange={(e) =>
                  onUpdate(field.id, {
                    options: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="例如：小号,中号,大号"
                value={field.options?.join(", ") || ""}
              />
            </>
          )}
        </div>

        <div className="col-span-12 flex items-center gap-6 border-t pt-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              checked={field.isRequired}
              className="rounded"
              onChange={(e) =>
                onUpdate(field.id, { isRequired: e.target.checked })
              }
              type="checkbox"
            />
            <span className="text-sm">必填</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              checked={field.isSkuSpec}
              className="rounded"
              onChange={(e) =>
                onUpdate(field.id, { isSkuSpec: e.target.checked })
              }
              type="checkbox"
            />
            <span className="font-medium text-indigo-600 text-sm">
              作为 SKU 规格
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
