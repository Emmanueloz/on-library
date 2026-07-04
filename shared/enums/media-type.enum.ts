export const MediaType = {
  IMAGE: "IMAGE",
  EPUB: "EPUB",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];
