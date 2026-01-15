import { envConfig } from "~/lib/env";

const imgDomain = envConfig.IMGDOMAIN;

export function getMediaUrl(storageKey: string): string {
  if (!storageKey) return "";
  return `${imgDomain}/${storageKey}`;
}

export function getThumbnailUrl(
  thumbnailStorageKey: string | null
): string | null {
  if (!thumbnailStorageKey) return null;
  return `${imgDomain}/${thumbnailStorageKey}`;
}
