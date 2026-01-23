"use client";

import { useSiteList } from "@/hooks/api/site";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface SiteSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SiteSelect({
  value,
  onChange,
  placeholder = "请选择站点",
  disabled = false,
}: SiteSelectProps) {
  const { data: sitesData, isLoading } = useSiteList({
    limit: 100,
    page: 0,
  });

  const sites = sitesData || [];

  return (
    <Select disabled={disabled} onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="px-2 py-1.5 text-muted-foreground text-sm">
            加载中...
          </div>
        ) : sites.length === 0 ? (
          <div className="px-2 py-1.5 text-muted-foreground text-sm">
            暂无站点数据
          </div>
        ) : (
          sites.map((site: any) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
              {site.domain && ` (${site.domain})`}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
