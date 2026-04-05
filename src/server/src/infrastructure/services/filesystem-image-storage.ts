import { writeFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { IImageStorageRepo } from "../../application/common/image-storage-repo.ts";

class FilesystemImageStorage implements IImageStorageRepo {
  private mediaDir: string;

  constructor(mediaDir: string) {
    this.mediaDir = mediaDir;
  }

  async saveImage(params: {
    folder: string;
    fileName: string;
    buffer: Buffer;
    baseUrl?: string;
  }): Promise<string> {
    const folderPath = join(this.mediaDir, params.folder);
    await mkdir(folderPath, { recursive: true });
    const filePath = join(folderPath, params.fileName);
    await writeFile(filePath, params.buffer);

    if (params.baseUrl) {
      return `${params.baseUrl}/media/${params.folder}/${params.fileName}`;
    }

    return filePath;
  }

  async deleteImage(url: string): Promise<void> {
    try {
      await unlink(url);
    } catch {
      const filePath = new URL(url).pathname;
      await unlink(join(this.mediaDir, filePath));
    }
  }

  generateFileName(originalName: string): string {
    const ext = originalName.split(".").pop() || "png";
    return `${randomUUID()}.${ext}`;
  }
}

export { FilesystemImageStorage };
