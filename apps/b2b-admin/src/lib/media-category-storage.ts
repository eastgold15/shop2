/**
 * 媒体分类存储工具
 * 用于管理用户自定义分类的使用记录和历史
 */

const STORAGE_KEY = "media_categories_history";

// 分类使用数据结构
export interface CategoryUsage {
  name: string;
  count: number;
  lastUsed: number;
}

// 存储数据结构
interface CategoryStorageData {
  categories: {
    [name: string]: CategoryUsage;
  };
  updatedAt: number;
}

// 预设分类
const PRESET_CATEGORIES = [
  "product",
  "hero_card",
  "ad",
  "document",
  "general",
] as const;

// 从 localStorage 读取分类数据
function loadFromStorage(): CategoryStorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load categories from localStorage:", error);
  }
  return { categories: {}, updatedAt: Date.now() };
}

// 保存分类数据到 localStorage
function saveToStorage(data: CategoryStorageData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save categories to localStorage:", error);
  }
}

/**
 * 记录分类使用
 * @param categoryName 分类名称
 */
export function recordCategoryUsage(categoryName: string) {
  if (!categoryName || categoryName.trim() === "") return;

  const data = loadFromStorage();
  const name = categoryName.trim();

  if (data.categories[name]) {
    data.categories[name].count += 1;
    data.categories[name].lastUsed = Date.now();
  } else {
    data.categories[name] = {
      name,
      count: 1,
      lastUsed: Date.now(),
    };
  }

  data.updatedAt = Date.now();
  saveToStorage(data);
}

/**
 * 获取所有分类
 * @returns 所有分类对象
 */
export function getAllCategories(): CategoryUsage[] {
  const data = loadFromStorage();
  return Object.values(data.categories);
}

/**
 * 获取所有分类名称
 * @returns 分类名称数组
 */
export function getCategoryNames(): string[] {
  return getAllCategories().map((cat) => cat.name);
}

/**
 * 获取热门分类（按使用次数排序）
 * @param limit 返回数量限制
 * @returns 热门分类列表
 */
export function getPopularCategories(limit = 5): CategoryUsage[] {
  return getAllCategories()
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 获取最近使用的分类（按最后使用时间排序）
 * @param limit 返回数量限制
 * @returns 最近使用的分类列表
 */
export function getRecentCategories(limit = 5): CategoryUsage[] {
  return getAllCategories()
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, limit);
}

/**
 * 获取推荐分类（热门 + 最近混合）
 * @param limit 返回总数限制
 * @returns 推荐分类列表
 */
export function getRecommendedCategories(limit = 10): CategoryUsage[] {
  const popular = getPopularCategories(Math.ceil(limit * 0.8));
  const recent = getRecentCategories(Math.ceil(limit * 0.2));

  const recommended = [...popular];
  const popularNames = new Set(popular.map((cat) => cat.name));

  for (const cat of recent) {
    if (!popularNames.has(cat.name) && recommended.length < limit) {
      recommended.push(cat);
    }
  }

  return recommended.slice(0, limit);
}

/**
 * 获取所有可用分类（预设 + 用户历史）
 * @returns 所有分类名称数组
 */
export function getAvailableCategories(): string[] {
  const userCategories = getCategoryNames();
  const presetCategories = [...PRESET_CATEGORIES] as string[];

  const allCategories = [...new Set([...presetCategories, ...userCategories])];
  return allCategories;
}

/**
 * 清空所有分类历史
 */
export function clearAllCategories() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear categories:", error);
  }
}

/**
 * 删除指定分类
 * @param categoryName 分类名称
 */
export function deleteCategory(categoryName: string) {
  const data = loadFromStorage();
  delete data.categories[categoryName];
  data.updatedAt = Date.now();
  saveToStorage(data);
}

/**
 * 获取预设分类列表
 * @returns 预设分类名称数组
 */
export function getPresetCategories(): readonly string[] {
  return PRESET_CATEGORIES;
}

/**
 * 搜索分类
 * @param keyword 搜索关键词
 * @returns 匹配的分类列表
 */
export function searchCategories(keyword: string): CategoryUsage[] {
  if (!keyword || keyword.trim() === "") {
    return getRecommendedCategories(10);
  }

  const lowerKeyword = keyword.toLowerCase().trim();
  return getAllCategories().filter(
    (cat) =>
      cat.name.toLowerCase().includes(lowerKeyword) ||
      PRESET_CATEGORIES.some(
        (preset) =>
          preset.toLowerCase().includes(lowerKeyword) && preset === cat.name
      )
  );
}

/**
 * 格式化分类名称用于显示
 * @param category 分类数据
 * @returns 显示名称
 */
export function formatCategoryName(category: CategoryUsage): string {
  return category.name;
}
