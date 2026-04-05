type CreateBodyType = {
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

export { type CreateBodyType };
