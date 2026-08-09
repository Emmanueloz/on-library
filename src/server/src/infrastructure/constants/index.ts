import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIRNAME_PROJECT = join(__dirname, "../");
const MEDIA_DIR = join(__dirname, "../../../uploads");


const MAX_EPUB_SIZE = 100 * 1024 * 1024;


export { MEDIA_DIR, MAX_EPUB_SIZE, DIRNAME_PROJECT };