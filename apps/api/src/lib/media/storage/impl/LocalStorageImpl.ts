// storage/impl/LocalStorage.ts
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { Storage } from "../Storage";


export class LocalStorage extends Storage {
  private readonly baseDir: string;
  private readonly baseUrl: string;

  constructor(config: { baseDir?: string; baseUrl?: string } = {}) {
    super(config);
    this.baseDir = config.baseDir || "public/uploads";
    this.baseUrl = config.baseUrl || "/uploads";
    fs.mkdir(this.baseDir, { recursive: true }).catch((e) => { console.error("本地目录创建失败:", e); });
  }

  async upload(file: File | Blob | Buffer | string, path?: string) {
    const { body, size, type } = await this.normalizeFile(file);
    const fileName = (file as File).name || 'file.bin';
    const key = path || this.generateKey(fileName);
    const fullPath = join(this.baseDir, key);

    // 确保子目录存在
    const dir = join(this.baseDir, key.split('/').slice(0, -1).join('/'));
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(fullPath, body);

    return {
      url: this.getPublicUrl(key),
      key,
      size,
      mimeType: type,
    };
  }

  // ... 实现 delete, exists 等 ...
  async delete(key: string) {
    try {
      const relativePath = this.extractKeyFromUrl(key);
      const fullPath = join(this.baseDir, relativePath);

      await fs.unlink(fullPath);
      return true;
    } catch (error) {
      console.error("本地文件删除失败:", error);
      return false;
    }
  }
  async exists(key: string) {
    try {
      const relativePath = this.extractKeyFromUrl(key);
      const fullPath = join(this.baseDir, relativePath);

      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * 重写父类方法，从本地文件 URL 中提取相对路径
   */
  protected extractKeyFromUrl(url: string): string {
    // 如果传入的本身就是相对路径，直接返回
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      // 移除基础 URL 前缀
      if (url.startsWith(`${this.baseUrl}/`)) {
        return url.substring(this.baseUrl.length + 1);
      }
      return url;
    }

    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;

      // 移除开头的斜杠
      if (pathname.startsWith("/")) {
        pathname = pathname.substring(1);
      }

      // 移除基础 URL 前缀
      if (pathname.startsWith(`${this.baseUrl}/`)) {
        return pathname.substring(this.baseUrl.length + 1);
      }

      return pathname;
    } catch {
      return url;
    }
  }
  getPublicUrl(key: string) {
    return `${this.baseUrl}/${key}`;
  }

  async getPresignedUrl(key: string) {
    // 本地存储没有预签名概念，直接返回 Public URL
    return await this.getPublicUrl(key);
  }
}