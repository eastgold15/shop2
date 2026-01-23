"use client";

import { Plus, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface AttributeEditorProps {
  value?: Record<string, string>;
  onChange: (attributes: Record<string, string>) => void;
  disabled?: boolean;
}

interface AttributeItem {
  id: string;
  key: string;
  value: string;
}

export const AttributeEditor: React.FC<AttributeEditorProps> = ({
  value = {},
  onChange,
  disabled = false,
}) => {
  // 使用 ref 来记录是否是内部更新，避免死循环
  const isInternalUpdate = useRef(false);
  const [items, setItems] = useState<AttributeItem[]>([]);

  // 初始化：仅在组件挂载或外部 value 真正改变时同步
  useEffect(() => {
    // 如果是内部触发的 onChange 导致的 value 变化，跳过同步
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const itemArray = Object.entries(value).map(([key, val], index) => ({
      // 使用 key 本身作为 ID 的一部分，或者在首次生成后保持稳定
      id: `${key}-${index}`,
      key,
      value: val,
    }));

    if (itemArray.length === 0 && !disabled) {
      setItems([{ id: "initial-empty", key: "", value: "" }]);
    } else {
      setItems(itemArray);
    }
  }, [value, disabled]);

  // 更新父组件
  const triggerChange = (newItems: AttributeItem[]) => {
    const attributes: Record<string, string> = {};
    newItems.forEach((item) => {
      if (item.key.trim()) {
        attributes[item.key.trim()] = item.value;
      }
    });

    isInternalUpdate.current = true; // 标记这是内部更新
    onChange(attributes);
  };

  const addItem = () => {
    const newList = [...items, { id: `new-${Date.now()}`, key: "", value: "" }];
    setItems(newList);
    // 注意：新行不需要立即 triggerChange，等用户填了 key 再传给父组件
  };

  const removeItem = (id: string) => {
    let newList = items.filter((item) => item.id !== id);
    if (newList.length === 0 && !disabled) {
      newList = [{ id: `empty-${Date.now()}`, key: "", value: "" }];
    }
    setItems(newList);
    triggerChange(newList);
  };

  const updateItem = (id: string, field: "key" | "value", newValue: string) => {
    const newList = items.map((item) =>
      item.id === id ? { ...item, [field]: newValue } : item
    );
    setItems(newList);

    // 只有当 key 或 value 变化时才同步给父组件
    triggerChange(newList);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">商品独有属性</h4>
        {!disabled && (
          <button
            className="flex items-center gap-1 text-gray-600 text-xs hover:text-black"
            onClick={addItem}
            type="button"
          >
            <Plus className="h-3 w-3" />
            添加属性
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div className="flex gap-2" key={item.id}>
            <input
              className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
              disabled={disabled}
              onChange={(e) => updateItem(item.id, "key", e.target.value)}
              placeholder="属性名（如：重量）"
              value={item.key}
            />
            <input
              className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
              disabled={disabled}
              onChange={(e) => updateItem(item.id, "value", e.target.value)}
              placeholder="属性值（如：100kg）"
              value={item.value}
            />
            {!disabled && items.length > 1 && (
              <button
                className="px-2 text-gray-400 hover:text-red-500"
                onClick={() => removeItem(item.id)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!disabled && items.length === 0 && (
        <p className="text-center text-gray-400 text-sm">暂无属性</p>
      )}
    </div>
  );
};
