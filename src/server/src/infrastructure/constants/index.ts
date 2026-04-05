import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIRNAME_PROJECT = join(__dirname, "../");
const MEDIA_DIR = join(__dirname, "../../../media");


const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];


export { MEDIA_DIR, ALLOWED_IMAGE_TYPES, DIRNAME_PROJECT };