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

const ALLOWED_PDF_TYPES = ["application/pdf"];

const EPUB_MIMETYPE = "application/epub+zip";
const EPUB_EXTENSION = ".epub";
const PDF_MIMETYPE = "application/pdf";
const PDF_EXTENSION = ".pdf";

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

  if (
    mimetype === PDF_MIMETYPE ||
    filename.toLowerCase().endsWith(PDF_EXTENSION)
  ) {
    return MediaType.PDF;
  }

  return null;
}

export {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_EPUB_TYPES,
  ALLOWED_PDF_TYPES,
  detectMediaType,
};
