import { writeFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { IMediaStorageRepo } from "../../application/common/media-storage-repo.ts";

class FilesystemMediaStorage implements IMediaStorageRepo {
  private mediaDir: string;

  constructor(mediaDir: string) {
    this.mediaDir = mediaDir;
  }

  async saveMedia(params: {
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

  async deleteMedia(url: string): Promise<void> {
    try {
      const { pathname } = new URL(url);
      const relativePath = pathname.replace(/^\/media\//, "");
      await unlink(join(this.mediaDir, relativePath));
    } catch {
      try {
        await unlink(url);
      } catch {
        // File may not exist on disk
      }
    }
  }

  generateFileName(originalName: string): string {
    const ext = originalName.split(".").pop() || "bin";
    return `${randomUUID()}.${ext}`;
  }
}

export { FilesystemMediaStorage };
