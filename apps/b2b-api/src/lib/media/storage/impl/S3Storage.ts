// storage/impl/S3Storage.ts
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type S3Config, Storage } from "../Storage";

export class S3Storage extends Storage {
  private readonly client: S3Client;
  private readonly s3Config: S3Config;

  constructor(config: S3Config) {
    super(config);
    this.s3Config = config;
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: false, // 阿里云 OSS 需要设为 false (使用虚拟主机模式)
    });
  }

  async upload(file: File | Blob | Buffer | string, path?: string) {
    const { body, size, type } = await this.normalizeFile(file);
    // 如果没有提供路径，尝试从 file 对象获取 name，或者生成随机名
    const fileName = (file as File).name || "file.bin";
    const key = path || this.generateKey(fileName);

    const command = new PutObjectCommand({
      Bucket: this.s3Config.bucket,
      Key: key,
      Body: body,
      ContentType: type,
    });

    await this.client.send(command);

    return {
      url: this.getPublicUrl(key),
      key,
      size,
      mimeType: type,
    };
  }

  async delete(key: string) {
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.s3Config.bucket, Key: key })
      );
      return true;
    } catch (e) {
      console.error("S3 delete error", e);
      return false;
    }
  }

  async exists(key: string) {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.s3Config.bucket, Key: key })
      );
      return true;
    } catch {
      return false;
    }
  }

  getPublicUrl(key: string): string {
    if (this.s3Config.domain) {
      // 去除 domain 末尾的 / 和 key 开头的 /
      const domain = this.s3Config.domain.replace(/\/$/, "");
      const cleanKey = key.replace(/^\//, "");
      return `${domain}/${cleanKey}`;
    }
    // 默认 OSS 格式
    const endpointHost = this.s3Config.endpoint.replace(/^https?:\/\//, "");
    return `https://${this.s3Config.bucket}.${endpointHost}/${key}`;
  }

  getPresignedUrl(key: string, method: "GET" | "PUT", expiresIn = 3600) {
    const command =
      method === "PUT"
        ? new PutObjectCommand({ Bucket: this.s3Config.bucket, Key: key })
        : new GetObjectCommand({ Bucket: this.s3Config.bucket, Key: key });

    return getSignedUrl(this.client, command, { expiresIn });
  }
}
