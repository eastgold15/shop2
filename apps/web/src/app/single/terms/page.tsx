import { MDXRemote } from "next-mdx-remote-client/rsc";
import { fetchPageContent } from "@/lib/fetch-page-content";
import { mdxComponents } from "@/lib/mdx-components";
import { SITE_CONFIG } from "@/lib/utils/constants";

const { PAGE_CONTENT_KEYS } = SITE_CONFIG;

export default async function TermsPage() {
  // 从服务器获取 MDX 内容
  const markdown = await fetchPageContent(PAGE_CONTENT_KEYS.terms);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <MDXRemote components={mdxComponents} source={markdown} />
      </div>
    </div>
  );
}
