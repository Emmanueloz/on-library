import type { FastifyInstance } from "fastify";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { MediaIdParams, type MediaIdParamsType } from "../../../../schemas/media/params.ts";
import { ChapterIdParams, type ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { MEDIA_DIR } from "../../../../../constants/index.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{
    Params: ChapterIdParamsType & MediaIdParamsType;
  }>(
    "/:mediaId",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        params: {
          allOf: [MediaIdParams, ChapterIdParams],
        },
      },
    },
    async (request, reply) => {
      const { mediaId } = request.params;

      const existingMedia = await fastify.mediaService.getById(mediaId);
      if (!existingMedia) {
        return reply.status(404).send({
          message: "Media not found",
        });
      }

      if (existingMedia.url) {
        try {
          const urlPath = new URL(existingMedia.url).pathname;
          const filePath = join(MEDIA_DIR, urlPath.replace(/^\/media\//, ""));
          await unlink(filePath);
        } catch (err) {
          console.error("Failed to delete file:", err);
        }
      }

      await fastify.mediaService.delete(mediaId);

      return {
        message: "Media deleted",
      };
    },
  );
}
