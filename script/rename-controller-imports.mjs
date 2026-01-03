import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controllersDir = path.join('g:', 'shop', 'apps', 'api', 'src', 'controllers');

// 重命名映射表
const renameMap = {
  'dailyinquirycounter': 'daily-inquiry-counter',
  'herocard': 'hero-card',
  'mastercategory': 'master-category',
  'mediametadata': 'media-metadata',
  'sitecategory': 'site-category',
  'siteconfig': 'site-config',
  'siteproduct': 'site-product',
  'skumedia': 'sku-media',
  'templatekey': 'template-key',
};

// 获取所有 controller 文件
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.controller.ts'));

files.forEach(file => {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 更新 import 路径（contract 和 service）
  for (const [oldName, newName] of Object.entries(renameMap)) {
    // 更新 contract import
    const contractRegex = new RegExp(`from.*${oldName}\\.contract`, 'g');
    if (contractRegex.test(content)) {
      content = content.replace(contractRegex, `from "${newName}.contract"`);
      modified = true;
    }

    // 更新 service import
    const serviceRegex = new RegExp(`from.*${oldName}\\.service`, 'g');
    if (serviceRegex.test(content)) {
      content = content.replace(serviceRegex, `from "${newName}.service"`);
      modified = true;
    }

    // 更新路由 prefix
    const oldPrefix = oldName.replace(/-/g, '');
    const newPrefix = newName;
    const prefixRegex = new RegExp(`prefix: "/${oldPrefix}"`, 'g');
    if (prefixRegex.test(content)) {
      content = content.replace(prefixRegex, `prefix: "/${newPrefix}"`);
      modified = true;
    }

    // 更新 service 实例变量名（驼峰化）
    const oldVarName = oldName.replace(/-/g, '');
    const newVarName = newName.split('-').map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');

    if (oldVarName !== newVarName && content.includes(`${oldVarName}Service`)) {
      content = content.replace(
        new RegExp(`const ${oldVarName}Service`, 'g'),
        `const ${newVarName}Service`
      );
      content = content.replace(
        new RegExp(`${oldVarName}Service\\.`, 'g'),
        `${newVarName}Service.`
      );
      modified = true;
    }

    // 更新 controller 导出名称
    const oldControllerName = `${oldName.replace(/-/g, '')}Controller`;
    const newControllerName = `${newVarName}Controller`;
    if (content.includes(`export const ${oldControllerName}`)) {
      content = content.replace(
        new RegExp(`export const ${oldControllerName}`, 'g'),
        `export const ${newControllerName}`
      );
      modified = true;
    }

    // 更新 tags
    const oldTag = oldName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    const newTag = newName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');

    if (oldTag !== newTag) {
      const tagRegex1 = new RegExp(`tags: \\["${oldTag}"\\]`, 'g');
      const tagRegex2 = new RegExp(`tags: \\['${oldTag}'\\]`, 'g');
      if (tagRegex1.test(content) || tagRegex2.test(content)) {
        content = content.replace(tagRegex1, `tags: ["${newTag}"]`);
        content = content.replace(tagRegex2, `tags: ['${newTag}']`);
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
  }
});

console.log('\n✨ Done! All controller files have been updated.');
