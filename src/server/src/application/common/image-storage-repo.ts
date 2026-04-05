interface IImageStorageRepo {
  saveImage(params: {
    folder: string;
    fileName: string;
    buffer: Buffer;
    baseUrl?: string | undefined;
  }): Promise<string>;

  deleteImage(url: string): Promise<void>;

  generateFileName(originalName: string): string;
}

export type { IImageStorageRepo };
