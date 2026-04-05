type CreatePagesBodyType = {
  file: {
    type: "field" | "file";
    fieldname?: string;
    filename?: string;
    value?: string;
    mimetype?: string;
    encoding?: string;
    toBuffer(): Promise<Buffer>;
  };
  pageNumber: {
    type: "field" | "file";
    fieldname?: string;
    filename?: string;
    value?: string;
    mimetype?: string;
    encoding?: string;
    toBuffer(): Promise<Buffer>;
  };
  type: {
    type: "field" | "file";
    fieldname?: string;
    filename?: string;
    value?: string;
    mimetype?: string;
    encoding?: string;
    toBuffer(): Promise<Buffer>;
  };
};

type UpdatePagesBodyType = Partial<CreatePagesBodyType>;
export type { CreatePagesBodyType, UpdatePagesBodyType };
