"use client";

import { Clock, Flame, Plus, Search, X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getAvailableCategories,
  getPopularCategories,
  getPresetCategories,
  getRecentCategories,
  recordCategoryUsage,
  searchCategories,
} from "@/lib/media-category-storage";
import { cn } from "@/lib/utils";

interface CategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  placeholder = "选择或输入分类...",
  allowClear = false,
  disabled = false,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<string[]>([]);

  const popularCategories = React.useMemo(() => getPopularCategories(5), []);
  const recentCategories = React.useMemo(() => getRecentCategories(5), []);
  const presetCategories = React.useMemo(() => getPresetCategories(), []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    recordCategoryUsage(selectedValue);
    setInputValue("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setOpen(false);
  };

  const handleInputValueChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue.trim()) {
      const results = searchCategories(newValue);
      setSearchResults(results.map((cat) => cat.name));
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const trimmedValue = inputValue.trim();
      handleSelect(trimmedValue);
    }
  };

  const displayCategories = inputValue.trim()
    ? searchResults
    : [...new Set([...presetCategories, ...getAvailableCategories()])];

  const hasPopular = popularCategories.length > 0;
  const hasRecent = recentCategories.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
            size="default"
            type="button"
            variant="outline"
          >
            <span className="truncate">{value || placeholder}</span>
            <div className="flex items-center gap-1">
              {value && allowClear && (
                <button
                  className="flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  type="button"
                >
                  <X className="size-3" />
                </button>
              )}
              <Search className="size-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-0">
          <Command>
            <CommandInput
              onKeyDown={handleKeyDown}
              onValueChange={handleInputValueChange}
              placeholder={placeholder}
              value={inputValue}
            />
            <CommandList>
              {displayCategories.length === 0 ? (
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-2 py-4">
                    <p className="text-muted-foreground text-sm">
                      没有找到匹配的分类
                    </p>
                    {inputValue.trim() && (
                      <Button
                        className="h-7"
                        onClick={() => handleSelect(inputValue.trim())}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        添加 "{inputValue.trim()}"
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
              ) : (
                <>
                  {!inputValue.trim() && hasPopular && (
                    <>
                      <CommandGroup heading="热门分类">
                        {popularCategories.map((cat) => {
                          const isSelected = value === cat.name;
                          return (
                            <CommandItem
                              key={cat.name}
                              onSelect={() => handleSelect(cat.name)}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <Flame className="h-3 w-3" />
                              </div>
                              <span className="flex-1">{cat.name}</span>
                              <Badge className="text-xs" variant="secondary">
                                {cat.count}
                              </Badge>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  {!inputValue.trim() && hasRecent && (
                    <>
                      <CommandGroup heading="最近使用">
                        {recentCategories.map((cat) => {
                          const isSelected = value === cat.name;
                          return (
                            <CommandItem
                              key={cat.name}
                              onSelect={() => handleSelect(cat.name)}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <Clock className="h-3 w-3" />
                              </div>
                              <span className="flex-1">{cat.name}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  <CommandGroup>
                    {displayCategories.map((categoryName) => {
                      const isSelected = value === categoryName;
                      const isPreset = presetCategories.includes(
                        categoryName as any
                      );
                      const popularCat = popularCategories.find(
                        (c) => c.name === categoryName
                      );
                      const recentCat = recentCategories.find(
                        (c) => c.name === categoryName
                      );

                      return (
                        <CommandItem
                          key={categoryName}
                          onSelect={() => handleSelect(categoryName)}
                          value={categoryName}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            {popularCat ? (
                              <Flame className="h-3 w-3" />
                            ) : recentCat ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </div>
                          <span className="flex-1">{categoryName}</span>
                          {isPreset && (
                            <Badge className="text-xs" variant="outline">
                              预设
                            </Badge>
                          )}
                          {!isPreset && popularCat && (
                            <Badge className="text-xs" variant="secondary">
                              {popularCat.count}
                            </Badge>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex items-center justify-between text-muted-foreground text-xs">
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          <span>最近使用会自动保存</span>
        </span>
        {value && (
          <Button
            className="h-6 text-xs"
            onClick={handleClear}
            size="sm"
            type="button"
            variant="ghost"
          >
            <X className="mr-1 size-3" />
            清除
          </Button>
        )}
      </div>
    </div>
  );
}
