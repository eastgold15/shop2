"use client";

import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { CreateTemplateModal } from "@/components/form/CreateTemplateModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDeleteTemplate, useTemplateList } from "@/hooks/api/template";

export default function TemplateManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const {
    data: templatesData,
    isLoading,
    refetch,
  } = useTemplateList({ page: 1, limit: 100 }, true);
  const deleteMutation = useDeleteTemplate();

  const templates = templatesData || [];

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这个模版吗？")) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error: any) {
        alert(error.message || "删除失败");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator className="mx-2 h-4" orientation="vertical" />
            <h1 className="font-bold text-lg text-slate-800">商品模版管理</h1>
          </div>
        </header>

        <main className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                <p className="mt-4 text-slate-500">加载中...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  className="flex items-center gap-2"
                  onClick={handleCreate}
                >
                  <Plus size={16} /> 创建新模版
                </Button>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 font-bold text-[11px] text-slate-500 uppercase">
                    <tr>
                      <th className="px-6 py-4">名称</th>
                      <th className="px-6 py-4">主分类</th>
                      <th className="px-6 py-4">结构</th>
                      <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {templates.length === 0 ? (
                      <tr>
                        <td
                          className="px-6 py-8 text-center text-slate-400"
                          colSpan={4}
                        >
                          暂无模版数据
                        </td>
                      </tr>
                    ) : (
                      templates.map((t: any) => (
                        <tr
                          className="transition-colors hover:bg-slate-50/50"
                          key={t.id}
                        >
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {t.name}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {t.categoryName || "未分配"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-[11px] text-indigo-600">
                              {t.fields?.length || 0} 个字段
                            </span>
                          </td>
                          <td className="space-x-1 px-6 py-4 text-right">
                            <Button
                              onClick={() => handleEdit(t)}
                              size="sm"
                              variant="ghost"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(t.id)}
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>

      <CreateTemplateModal
        editingTemplate={editingTemplate}
        onOpenChange={handleModalClose}
        onSuccess={handleModalSuccess}
        open={isModalOpen}
      />
    </SidebarProvider>
  );
}
