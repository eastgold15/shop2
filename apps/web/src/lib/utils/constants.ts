// Note: bug in nodejs cant import env into middleware.ts
export const SERVER_URL_KEY = "x-url";


export const SITE_CONFIG = {
  SITE_CONFIG_KEYS: {
    site_name: "site_name",
    site_phone: "site_phone",
    site_email: "site_email",
    site_copyright: "site_copyright",
    site_erweima: "site_erweima",
  },
  PAGE_CONTENT_KEYS: {
    about: "page_about_content", // 关于我们
    contact: "page_contact_content", // 联系我们
    privacy: "page_privacy_content", // 隐私政策
    ship: "page_ship_content", // 运输与退货
    size: "page_size_content", // 尺码指南
    terms: "page_terms_content", // 服务条款
  }
};
