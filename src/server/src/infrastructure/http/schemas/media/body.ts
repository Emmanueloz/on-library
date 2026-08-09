type MediaFileType = {
  type: "file";
  fieldname?: string;
  filename?: string;
  mimetype?: string;
  encoding?: string;
  toBuffer(): Promise<Buffer>;
};

type MediaFieldType = {
  type: "field" | "file";
  fieldname?: string;
  filename?: string;
  value?: string;
  mimetype?: string;
  encoding?: string;
  toBuffer(): Promise<Buffer>;
};

type CreateMediaBatchBodyType = {
  files: MediaFileType[] | MediaFileType;
};

type UpdateMediaBodyType = {
  file?: MediaFileType;
  pageNumber?: MediaFieldType;
  type?: MediaFieldType;
};

export type { MediaFileType, CreateMediaBatchBodyType, UpdateMediaBodyType };
