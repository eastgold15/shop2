"use client";

import { Plus, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

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
  // 将对象转换为数组形式便于管理
  const [items, setItems] = useState<AttributeItem[]>([]);

  // 初始化：当 value 变化时同步到 items
  useEffect(() => {
    const itemArray = Object.entries(value).map(([key, val]) => ({
      id: `${key}-${Date.now()}-${Math.random()}`,
      key,
      value: val,
    }));
    // 如果是空的，添加一个空行
    if (itemArray.length === 0 && !disabled) {
      setItems([{ id: "new-1", key: "", value: "" }]);
    } else {
      setItems(itemArray);
    }
  }, [value, disabled]);

  // 更新父组件的值
  useEffect(() => {
    const attributes: Record<string, string> = {};
    items.forEach((item) => {
      if (item.key.trim()) {
        attributes[item.key.trim()] = item.value;
      }
    });
    // 只有当有有效属性时才更新
    if (Object.keys(attributes).length > 0) {
      onChange(attributes);
    } else if (items.length === 0 || (items.length === 1 && !items[0].key)) {
      onChange({});
    }
  }, [items, onChange]);

  const addItem = () => {
    setItems([...items, { id: `new-${Date.now()}`, key: "", value: "" }]);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    if (newItems.length === 0 && !disabled) {
      setItems([{ id: "new-1", key: "", value: "" }]);
    } else {
      setItems(newItems);
    }
  };

  const updateItem = (id: string, field: "key" | "value", newValue: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
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
        {items.map((item, index) => (
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

      {items.length === 0 && (
        <p className="text-center text-gray-400 text-sm">暂无属性</p>
      )}
    </div>
  );
};
