import type { FastifyInstance } from "fastify";
import { ChapterIdParams, type ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { PageIdParams, type PageIdParamsType } from "../../../../schemas/pages/params.ts";


export default async function (fastify: FastifyInstance) {
  fastify.get<{
    Params: ChapterIdParamsType;
  }>(
    "/",
    {
      schema: {
        tags: ["Pages"],
      },
    },
    async (request, reply) => {
      const { id: idChapter } = request.params;

      const pages = await fastify.pagesService.query(idChapter);

      return {
        message: "Pages",
        data: pages,
      };
    },
  );

  fastify.get<{
    Params: PageIdParamsType & ChapterIdParamsType;
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

      const page = await fastify.pagesService.getById(pageId);

      if (!page) {
        return reply.status(404).send({
          message: "Page not found",
        });
      }

      return {
        message: "Page",
        data: page,
      };
    },
  );
}
