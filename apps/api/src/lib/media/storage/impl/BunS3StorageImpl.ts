// storage/impl/BunS3StorageImpl.ts
import { S3Client } from "bun"; // 必须使用 Bun 原生 S3
import { type S3Config, Storage, type UploadResponse } from "../Storage";

export class BunS3StorageImpl extends Storage {
  private readonly client: S3Client;

  constructor(config: S3Config) {
    super(config);

    // 1. 提取纯域名并强制构建三级域名 Endpoint，解决 SecondLevelDomainForbidden 错误
    const pureEndpoint = config.endpoint.replace(/^https?:\/\//, "").replace(/\/+$/, "");

    this.client = new S3Client({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      bucket: config.bucket,
      // 明确指定三级域名格式以强制使用 Virtual Hosted Style
      endpoint: `https://${config.bucket}.${pureEndpoint}`,
      region: config.region || "oss-cn-hongkong",
    });
  }

  /**
   * 内部统一清理 Key 的方法，防止路径中出现双斜杠或前导斜杠导致 ERR_S3_INVALID_PATH
   */
  private getCleanKey(key: string): string {
    return key.replace(/^\/+/, "");
  }

  /**
   * 生成纯净的文件名，不带任何默认文件夹前缀
   */
  private generatePureFileName(originalName: string): string {
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const random = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    // 移除文件名中的非标准字符，防止 URL 编码导致 NoSuchKey
    const safeName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    return `${timestamp}_${safeName}_${random}.${ext}`;
  }

  async upload(file: any, folder?: string): Promise<UploadResponse> {
    const { body, size, type } = await this.normalizeFile(file);
    const originalName = file instanceof File ? file.name : "file.bin";

    // 构建 Key：如果传入 folder(category)，则拼接为 folder/filename，否则仅为 filename
    const fileName = this.generatePureFileName(originalName);
    const fullPath = folder ? `${folder.replace(/\/+$/, "")}/${fileName}` : fileName;
    const cleanKey = this.getCleanKey(fullPath);

    try {
      const s3File = this.client.file(cleanKey);
      await s3File.write(body, { type });

      const publicUrl = this.getPublicUrl(cleanKey);

      console.log('Upload Success - Key:', cleanKey);
      console.log('Upload Success - URL:', publicUrl);

      return {
        url: publicUrl,
        key: cleanKey,
        size,
        mimeType: type,
      };
    } catch (error) {
      console.error("Bun S3 Write Error:", error);
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    const cleanKey = this.getCleanKey(key);
    await this.client.file(cleanKey).delete();
    return true;
  }

  async exists(key: string): Promise<boolean> {
    const cleanKey = this.getCleanKey(key);
    return await this.client.file(cleanKey).exists();
  }

  /**
   * 按照自定义域名或阿里云 OSS 规范生成访问地址
   */
  getPublicUrl(key: string): string {
    const cleanKey = this.getCleanKey(key);

    // 优先使用自定义域名 (如 https://img.poripori.top)
    if (this.config.domain) {
      const baseDomain = this.config.domain.replace(/\/+$/, "");
      return `${baseDomain}/${this.config.bucket}/${cleanKey}`;
    }

    // 回退到阿里云虚拟托管域名格式
    const pureEndpoint = this.config.endpoint.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const bucketPrefix = `${this.config.bucket}.`;

    // 检查 endpoint 是否已包含 bucket 前缀，避免重复拼接
    const finalHost = pureEndpoint.startsWith(bucketPrefix)
      ? pureEndpoint
      : `${this.config.bucket}.${pureEndpoint}`;

    return `https://${finalHost}/${cleanKey}`;
  }

  async getPresignedUrl(
    key: string,
    method: "GET" | "PUT",
    expiresIn?: number
  ): Promise<string> {
    const cleanKey = this.getCleanKey(key);
    const s3File = this.client.file(cleanKey);
    return await s3File.presign({
      method,
      expiresIn: expiresIn ?? 3600,
    });
  }
}