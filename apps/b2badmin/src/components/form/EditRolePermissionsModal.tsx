"use client";

import { Check, Loader2, Search, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissionsList } from "@/hooks/api/permission";
import { useRoleDetail, useSetRolePermissions } from "@/hooks/api/role";

interface EditRolePermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string;
  roleName: string;
  onSuccess?: () => void;
}

export function EditRolePermissionsModal({
  open,
  onOpenChange,
  roleId,
  roleName,
  onSuccess,
}: EditRolePermissionsModalProps) {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<
    Set<string>
  >(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // 获取所有权限列表
  const { data: allPermissions = [], isLoading: permissionsLoading } =
    usePermissionsList();

  // 获取角色详情（包含现有权限）
  const { data: roleDetail, isLoading: roleDetailLoading } = useRoleDetail(
    roleId,
    {
      enabled: open,
    }
  );

  const batchUpdate = useSetRolePermissions();

  // 将权限按资源分组
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, typeof allPermissions> = {};

    allPermissions.forEach((permission) => {
      // 从权限名中提取资源部分 (如 "USER_VIEW" -> "USER")
      const match = permission.name?.match(
        /^([A-Z_]+)_(VIEW|CREATE|EDIT|DELETE)$/
      );
      if (match) {
        const resource = match[1];
        if (!groups[resource]) {
          groups[resource] = [];
        }
        groups[resource].push(permission);
      }
    });

    return groups;
  }, [allPermissions]);

  // 根据搜索词过滤资源
  const filteredResources = useMemo(() => {
    if (!searchTerm) return Object.entries(groupedPermissions);
    return Object.entries(groupedPermissions).filter(([resource]) =>
      resource.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupedPermissions, searchTerm]);

  // 当角色权限加载完成后，初始化已选中的权限 ID
  useEffect(() => {
    if (roleDetail?.permissions && open) {
      const selectedIds = new Set(
        roleDetail.permissions
          .map((rp: any) => rp.id)
          .filter((id: string | undefined): id is string => !!id)
      );
      setSelectedPermissionIds(selectedIds);
    }
  }, [roleDetail, open]);

  // 切换单个权限
  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      return next;
    });
  };

  // 切换整个资源的所有权限
  const toggleResource = (
    permissions: typeof allPermissions,
    shouldSelect: boolean
  ) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      permissions.forEach((p) => {
        if (shouldSelect) {
          next.add(p.id);
        } else {
          next.delete(p.id);
        }
      });
      return next;
    });
  };

  // 检查资源的选中状态
  const checkResourceStatus = (permissions: typeof allPermissions) => {
    const checkedCount = permissions.filter((p) =>
      selectedPermissionIds.has(p.id)
    ).length;
    return {
      isFull: checkedCount === permissions.length,
      isPartial: checkedCount > 0 && checkedCount < permissions.length,
      isEmpty: checkedCount === 0,
    };
  };

  // 保存权限
  const handleSave = async () => {
    try {
      await batchUpdate.mutateAsync({
        id: roleId,
        permissionIds: Array.from(selectedPermissionIds),
      });
      toast.success(`权限保存成功（共 ${selectedPermissionIds.size} 项）`);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("保存权限失败:", error);
      toast.error("权限保存失败");
    }
  };

  const isLoading = permissionsLoading || roleDetailLoading;

  if (isLoading) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            编辑角色权限 - {roleName}
          </DialogTitle>
          <DialogDescription>
            为该角色配置相应的系统权限，控制用户可访问的功能
          </DialogDescription>
        </DialogHeader>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索权限资源（如：USER, PRODUCT）..."
            value={searchTerm}
          />
        </div>

        {/* 权限列表 */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                未找到相关资源
              </div>
            ) : (
              filteredResources.map(([resource, permissions]) => {
                const status = checkResourceStatus(permissions);

                return (
                  <div
                    className="rounded-lg border bg-slate-50 p-4"
                    key={resource}
                  >
                    {/* 资源标题 + 全选 */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={
                            status.isFull ||
                            (status.isPartial ? "indeterminate" : false)
                          }
                          onCheckedChange={(checked) =>
                            toggleResource(permissions, !!checked)
                          }
                        />
                        <h3 className="font-semibold text-slate-900">
                          {resource}
                        </h3>
                        {status.isPartial && !status.isFull && (
                          <span className="text-slate-500 text-xs">
                            (部分选中)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 权限操作列表 */}
                    <div className="ml-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {permissions.map((permission) => {
                        const action =
                          permission.name?.replace(`${resource}_`, "") ||
                          permission.name;
                        const isSelected = selectedPermissionIds.has(
                          permission.id
                        );

                        return (
                          <div
                            className="flex items-center space-x-2 rounded border border-transparent bg-white p-2 hover:border-indigo-100"
                            key={permission.id}
                          >
                            <Checkbox
                              checked={isSelected}
                              id={permission.id}
                              onCheckedChange={() =>
                                togglePermission(permission.id)
                              }
                            />
                            <label
                              className="cursor-pointer select-none text-sm"
                              htmlFor={permission.id}
                            >
                              {action}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* 底部统计 */}
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-slate-600 text-sm">
            已选择{" "}
            <span className="font-semibold text-indigo-600">
              {selectedPermissionIds.size}
            </span>{" "}
            个权限
          </p>
        </div>

        <DialogFooter>
          <Button
            disabled={batchUpdate.isPending}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            取消
          </Button>
          <Button
            disabled={batchUpdate.isPending}
            onClick={handleSave}
            type="submit"
          >
            {batchUpdate.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                保存权限
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
