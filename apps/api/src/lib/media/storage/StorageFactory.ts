// storage/StorageFactory.ts

import { LocalStorage } from "./impl/LocalStorageImpl";
import { S3Storage } from "./impl/S3Storage";
import { Storage } from "./Storage";
export type StorageType = "oss" | "local" | "s3"; // oss 和 s3 其实是一样的

export class StorageFactory {
  private static instance: Storage;

  static create(type: StorageType = "local"): Storage {
    if (StorageFactory.instance) return StorageFactory.instance;

    if (type === "oss" || type === "s3") {
      StorageFactory.instance = new S3Storage({
        accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.OSS_SECRET_ACCESS_KEY!,
        bucket: process.env.OSS_BUCKET!,
        endpoint: process.env.OSS_ENDPOINT!,
        region: process.env.OSS_REGION || "oss-cn-hangzhou",
        domain: process.env.OSS_DOMAIN,
      });
    } else {
      StorageFactory.instance = new LocalStorage({
        baseDir: "public/uploads",
        baseUrl: "/uploads",
      });
    }

    return StorageFactory.instance;
  }
}
