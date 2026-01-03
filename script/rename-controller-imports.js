const fs = require('fs');
const path = require('path');

const controllersDir = 'g:\\shop\\apps\\api\\src\\controllers';

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
    content = content.replace(
      new RegExp(`from.*${oldName}\\.contract`, 'g'),
      `from "${newName}.contract`
    );

    // 更新 service import
    content = content.replace(
      new RegExp(`from.*${oldName}\\.service`, 'g'),
      `from "${newName}.service`
    );

    // 更新 service 实例变量名（驼峰化）
    const oldVarName = oldName.replace(/-/g, ''); // 移除可能的连字符
    const newVarName = newName.split('-').map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');

    if (oldVarName !== newVarName) {
      content = content.replace(
        new RegExp(`const ${oldVarName}Service`, 'g'),
        `const ${newVarName}Service`
      );
      content = content.replace(
        new RegExp(`${oldVarName}Service\\.`, 'g'),
        `${newVarName}Service.`
      );
    }

    // 更新路由 prefix
    const oldPrefix = oldName.replace(/-/g, ''); // 移除可能的连字符
    const newPrefix = newName;
    content = content.replace(
      new RegExp(`prefix: "/${oldPrefix}"`, 'g'),
      `prefix: "/${newPrefix}"`
    );

    // 更新 controller 导出名称
    const oldControllerName = `${oldName.replace(/-/g, '')}Controller`;
    const newControllerName = `${newVarName}Controller`;
    content = content.replace(
      new RegExp(`export const ${oldControllerName}`, 'g'),
      `export const ${newControllerName}`
    );

    // 更新 tags
    const oldTag = oldName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    const newTag = newName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');

    if (oldTag !== newTag) {
      content = content.replace(
        new RegExp(`tags: \\["${oldTag}"\\]`, 'g'),
        `tags: ["${newTag}"]`
      );
      content = content.replace(
        new RegExp(`tags: \\['${oldTag}'\\]`, 'g'),
        `tags: ['${newTag}']`
      );
    }

    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
  }
});

console.log('\n✨ Done! All controller files have been updated.');
