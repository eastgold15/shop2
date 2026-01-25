import { rpc } from "@/lib/rpc";
import { SITE_CONFIG } from "@/lib/utils/constants";

const { PAGE_CONTENT_KEYS } = SITE_CONFIG;

/**
 * 从 site_config 获取页面 MDX 内容
 * @param key - site_config 的 key
 * @returns MDX 字符串内容
 */
export async function fetchPageContent(key: string): Promise<string> {
  try {
    const response = await rpc["site-config"].get({
      query: { key },
    });

    const content = response.data?.[0]?.value;

    if (!content) {
      console.warn(`[fetchPageContent] No content found for key: ${key}`);
      return getDefaultContent(key);
    }

    return content;
  } catch (error) {
    console.error(
      `[fetchPageContent] Failed to fetch page content for key: ${key}`,
      error
    );
    return getDefaultContent(key);
  }
}

/**
 * 获取默认内容（降级方案）
 * 当数据库中没有配置内容时，返回此默认内容
 */
function getDefaultContent(key: string): string {
  const defaults: Record<string, string> = {
    [PAGE_CONTENT_KEYS.about]: `# About Us

Content not found. Please configure the page content in site settings.`,
    [PAGE_CONTENT_KEYS.contact]: `# Contact Us

Content not found. Please configure the page content in site settings.`,
    [PAGE_CONTENT_KEYS.privacy]: `# Privacy Policy

Content not found. Please configure the page content in site settings.`,
    [PAGE_CONTENT_KEYS.ship]: `# Shipping & Returns

Content not found. Please configure the page content in site settings.`,
    [PAGE_CONTENT_KEYS.size]: `# Size Guide

Content not found. Please configure the page content in site settings.`,
    [PAGE_CONTENT_KEYS.terms]: `# Terms of Service

Content not found. Please configure the page content in site settings.`,
  };

  return (
    defaults[key] ||
    `# Content Not Found

Please configure the page content in site settings.`
  );
}
