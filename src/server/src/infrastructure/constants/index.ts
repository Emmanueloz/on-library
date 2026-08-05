import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIRNAME_PROJECT = join(__dirname, "../");
const MEDIA_DIR = join(__dirname, "../../../uploads");


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

const MAX_EPUB_SIZE = 100 * 1024 * 1024;


export { MEDIA_DIR, ALLOWED_IMAGE_TYPES, ALLOWED_EPUB_TYPES, MAX_EPUB_SIZE, DIRNAME_PROJECT };