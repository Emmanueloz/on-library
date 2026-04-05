import type { FastifyInstance } from "fastify";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PageIdParams, type PageIdParamsType } from "../../../../schemas/pages/params.ts";
import { ChapterIdParams, type ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";


const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const MEDIA_DIR = join(__dirname, "../../../../../../../../media");

export default async function (fastify: FastifyInstance) {
  fastify.delete<{
    Params: ChapterIdParamsType & PageIdParamsType;
  }>(
    "/:pageId",
    {
      schema: {
        tags: ["Pages"],
        params: {
          allOf: [PageIdParams, ChapterIdParams],
        },
      },
    },
    async (request, reply) => {
      const { pageId } = request.params;

      const existingPage = await fastify.pagesService.getById(pageId);
      if (!existingPage) {
        return reply.status(404).send({
          message: "Page not found",
        });
      }

      if (existingPage.url) {
        try {
          const urlPath = new URL(existingPage.url).pathname;
          const filePath = join(MEDIA_DIR, urlPath);
          await unlink(filePath);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }

      await fastify.pagesService.delete(pageId);

      return {
        message: "Page deleted",
      };
    },
  );
}
