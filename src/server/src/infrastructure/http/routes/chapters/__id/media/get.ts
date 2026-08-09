import type { FastifyInstance } from "fastify";
import { ChapterIdParams, type ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { MediaIdParams, type MediaIdParamsType } from "../../../../schemas/media/params.ts";


export default async function (fastify: FastifyInstance) {
  fastify.get<{
    Params: ChapterIdParamsType;
  }>(
    "/",
    {
      schema: {
        tags: ["Media"],
      },
    },
    async (request, reply) => {
      const { id: idChapter } = request.params;

      const media = await fastify.mediaService.query(idChapter);

      return {
        message: "Media",
        data: media,
      };
    },
  );

  fastify.get<{
    Params: MediaIdParamsType & ChapterIdParamsType;
  }>(
    "/:mediaId",
    {
      schema: {
        tags: ["Media"],
        params: {
          allOf: [MediaIdParams, ChapterIdParams],
        },
      },
    },
    async (request, reply) => {
      const { mediaId } = request.params;

      const media = await fastify.mediaService.getById(mediaId);

      if (!media) {
        return reply.status(404).send({
          message: "Media not found",
        });
      }

      return {
        message: "Media",
        data: media,
      };
    },
  );
}
