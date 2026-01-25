// Note: bug in nodejs cant import env into middleware.ts
export const SERVER_URL_KEY = "x-url";

// 站点配置键选项
export const SITE_CONFIG_KEY_OPTIONS = [
  { value: "site_name", label: "网站名" },
  { value: "site_copyright", label: "版权" },
  { value: "site_phone", label: "电话" },
  { value: "site_email", label: "邮箱" },
  { value: "site_erweima", label: "二维码" },
  { value: "page_about_content", label: "关于我们" },
  { value: "page_contact_content", label: "联系我们" },
  { value: "page_privacy_content", label: "隐私政策" },
  { value: "page_size_content", label: "尺码指南" },
  { value: "page_terms_content", label: "服务条款" },
] as const;
