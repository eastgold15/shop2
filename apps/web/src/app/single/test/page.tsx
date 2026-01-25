// 远程 MDX 加载示例
import { MDXRemote } from "next-mdx-remote-client/rsc";

// 自定义 MDX 组件
const components = {
  Alert: ({ type, children }: { type: string; children: React.ReactNode }) => (
    <div
      className={`rounded p-4 ${type === "success" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
    >
      {children}
    </div>
  ),
};

// 模拟从远程获取 MDX 内容（后续替换为真实 API）
async function getRemoteMdxContent(): Promise<string> {
  // TODO: 替换为真实的远程数据源
  // const res = await fetch('https://your-api.com/content/mdx')
  // return await res.text()

  return `
# 远程 MDX 示例

这是从**远程源**加载的 MDX 内容：

## 功能特性

- 支持 GitHub Flavored Markdown
- 可以嵌入 React 组件
- 服务端组件渲染
- 类型安全

## 自定义组件示例

<Alert type="success">这是一个成功提示！</Alert>

<Alert type="info">这是一个信息提示</Alert>

## 代码示例

\`\`\`typescript
const greeting = "Hello, MDX!";
console.log(greeting);
\`\`\`

## 链接测试

访问 [Next.js](https://nextjs.org) 了解更多信息。
  `;
}

export default async function RemoteMdxPage() {
  // 从远程获取 MDX 内容
  const markdown = await getRemoteMdxContent();

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto max-w-4xl p-8">
      <MDXRemote components={components} source={markdown} />
    </div>
  );
}
