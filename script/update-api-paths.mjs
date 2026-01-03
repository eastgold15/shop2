import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hooksDir = path.join('g:', 'shop', 'apps', 'b2badmin', 'src', 'hooks', 'api');

// API 路径重命名映射表
const apiPathMap = {
  'dailyinquirycounter': 'daily-inquiry-counter',
  'herocard': 'hero-card',
  'mastercategory': 'master-category',
  'mediametadata': 'media-metadata',
  'sitecategory': 'site-category',
  'siteconfig': 'site-config',
  'siteproduct': 'site-product',
  'skumedia': 'sku-media',
  'templatekey': 'template-key',
  'productmastercategory': 'product-master-category',
  'productmedia': 'product-media',
  'productsitecategory': 'product-site-category',
  'userrole': 'user-role',
};

// 获取所有 hooks 文件
const files = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts') && f !== 'api-client.ts' && f !== 'index.ts' && f !== 'utils.ts');

files.forEach(file => {
  const filePath = path.join(hooksDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 更新 API 路径
  for (const [oldName, newName] of Object.entries(apiPathMap)) {
    // 更新 /api/v1/xxx 路径
    const oldPathPattern = new RegExp(`/api/v1/${oldName}`, 'g');
    if (oldPathPattern.test(content)) {
      content = content.replace(oldPathPattern, `/api/v1/${newName}`);
      modified = true;
    }

    // 更新 /api/v1/xxx/:id 路径
    const oldPathWithIdPattern = new RegExp(`/api/v1/${oldName}/\\$\\{id\\}`, 'g');
    if (oldPathWithIdPattern.test(content)) {
      content = content.replace(oldPathWithIdPattern, `/api/v1/${newName}/\${id}`);
      modified = true;
    }

    // 更新 /api/v1/xxx/:id/action 路径
    const oldPathWithActionPattern = new RegExp(`/api/v1/${oldName}/\\$\\{id}/([a-zA-Z]+)`, 'g');
    if (oldPathWithActionPattern.test(content)) {
      content = content.replace(oldPathWithActionPattern, `/api/v1/${newName}/\${id}/$1`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated API paths in: ${file}`);
  }
});

console.log('\n✨ Done! All API paths have been updated to kebab-case.');
