import { MediaType } from "../enums/media-type.enum.ts";

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const ALLOWED_EPUB_TYPES = [
  "application/epub+zip",
  "application/octet-stream",
];

const EPUB_MIMETYPE = "application/epub+zip";
const EPUB_EXTENSION = ".epub";

function detectMediaType(mimetype: string, filename: string): MediaType | null {
  if (ALLOWED_IMAGE_TYPES.includes(mimetype)) {
    return MediaType.IMAGE;
  }

  if (
    mimetype === EPUB_MIMETYPE ||
    filename.toLowerCase().endsWith(EPUB_EXTENSION)
  ) {
    return MediaType.EPUB;
  }

  return null;
}

export { ALLOWED_IMAGE_TYPES, ALLOWED_EPUB_TYPES, detectMediaType };
