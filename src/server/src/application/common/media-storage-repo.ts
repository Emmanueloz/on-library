interface IMediaStorageRepo {
  saveMedia(params: {
    folder: string;
    fileName: string;
    buffer: Buffer;
    baseUrl?: string | undefined;
  }): Promise<string>;

  deleteMedia(url: string): Promise<void>;

  generateFileName(originalName: string): string;
}

export type { IMediaStorageRepo };
