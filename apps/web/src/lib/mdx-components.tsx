import type { MDXComponents } from "next-mdx-remote-client/rsc";

/**
 * 自定义 Alert 组件
 */
function Alert({
  type = "info",
  children,
}: {
  type?: "success" | "info" | "warning" | "error";
  children: React.ReactNode;
}) {
  const baseClass = "my-4 rounded p-4";
  const typeClass =
    type === "success"
      ? "bg-green-100 text-green-800"
      : type === "warning"
        ? "bg-yellow-100 text-yellow-800"
        : type === "error"
          ? "bg-red-100 text-red-800"
          : "bg-blue-100 text-blue-800";

  return <div className={`${baseClass} ${typeClass}`}>{children}</div>;
}

/**
 * 共享 MDX 组件定义
 * 用于 next-mdx-remote-client 的 RSC 模式
 */
export const mdxComponents: MDXComponents = {
  Alert,
};
