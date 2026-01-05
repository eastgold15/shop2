/**
 * SKU 笛卡尔积生成器
 * 用于根据规格属性生成所有可能的 SKU 组合
 */

export interface SpecAttribute {
  key: string;
  values: string[];
}

export interface SpecCombination {
  [key: string]: string;
}

/**
 * 生成笛卡尔积
 * @param attributes 规格属性数组,例如: [{ key: "颜色", values: ["红", "白"] }, { key: "尺码", values: ["40", "41"] }]
 * @returns 所有可能的组合,例如: [{ "颜色": "红", "尺码": "40" }, { "颜色": "红", "尺码": "41" }, ...]
 */
export function generateCartesianProduct(
  attributes: SpecAttribute[]
): SpecCombination[] {
  // 如果没有属性,返回空
  if (attributes.length === 0) {
    return [];
  }

  // 递归/Reduce 实现笛卡尔积
  return attributes.reduce<SpecCombination[]>(
    (acc, curr) => {
      const res: SpecCombination[] = [];
      acc.forEach((prevItem) => {
        curr.values.forEach((value) => {
          res.push({ ...prevItem, [curr.key]: value });
        });
      });
      return res;
    },
    [{}] as SpecCombination[]
  );
}

/**
 * 计算预计生成的 SKU 数量
 * @param generatorData 规格数据,例如: { "颜色": ["红", "白"], "尺码": ["40", "41"] }
 * @returns 预计生成的 SKU 数量
 */
export function calculateEstimatedCount(
  generatorData: Record<string, string[]>
): number {
  const counts = Object.values(generatorData)
    .filter((values) => values.length > 0)
    .map((values) => values.length);

  if (counts.length === 0) {
    return 0;
  }

  return counts.reduce((acc, count) => acc * count, 1);
}

/**
 * 从 specJson 生成可读的规格描述
 * @param specJson 规格JSON对象,例如: { "颜色": "红", "尺码": "40" }
 * @returns 可读的描述,例如: "颜色:红 尺码:40"
 */
export function formatSpecDescription(specJson: Record<string, string>): string {
  return Object.entries(specJson)
    .map(([key, value]) => `${key}:${value}`)
    .join(" ");
}
