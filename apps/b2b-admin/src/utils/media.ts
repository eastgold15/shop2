/**
 * 媒体文件扩展名常量
 */
export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg"] as const;
export const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi", "mkv"] as const;

/**
 * 从 URL 中提取文件扩展名
 * @param url - 文件 URL
 * @returns 小写的文件扩展名，如果没有则返回空字符串
 */
export function getFileExtension(url?: string): string {
  return url?.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * 判断文件是否为图片（根据文件后缀）
 * @param url - 文件 URL
 * @returns 是否为图片
 */
export function isImageFile(url?: string): boolean {
  const ext = getFileExtension(url);
  return IMAGE_EXTENSIONS.includes(ext as any);
}

/**
 * 判断文件是否为视频（根据文件后缀）
 * @param url - 文件 URL
 * @returns 是否为视频
 */
export function isVideoFile(url?: string): boolean {
  const ext = getFileExtension(url);
  return VIDEO_EXTENSIONS.includes(ext as any);
}
