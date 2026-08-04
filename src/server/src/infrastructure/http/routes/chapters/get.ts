import type { FastifyInstance } from "fastify";
import {
  ChapterIdParams,
  type ChapterIdParamsType,
} from "../../schemas/chapters/params.ts";
import {
  ChaptersQuerySchema,
  LatestBySeriesQuery,
  type ChaptersQuerySchemaType,
  type LatestBySeriesQueryType,
} from "../../schemas/chapters/queries.ts";


export default async function (fastify: FastifyInstance) {
  fastify.get<{
    Querystring: ChaptersQuerySchemaType;
  }>(
    "/",
    {
      schema: {
        tags: ["Chapters"],
        querystring: ChaptersQuerySchema,
      },
    },
    async (request, reply) => {
      const query = request.query;

      const chapters = await fastify.chaptersService.query(query);

      return {
        message: "Chapters",
        data: chapters,
      };
    },
  );

  fastify.get<{
    Querystring: LatestBySeriesQueryType;
  }>(
    "/latest-by-series",
    {
      schema: {
        tags: ["Chapters"],
        querystring: LatestBySeriesQuery,
      },
    },
    async (request, reply) => {
      const limit = request.query.limit ?? 20;
      const chapters = await fastify.chaptersService.getLatestBySeries(limit);

      return {
        message: "Latest chapters by series",
        data: chapters,
      };
    },
  );

  fastify.get<{
    Params: ChapterIdParamsType;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Chapters"],
        params: ChapterIdParams,
      },
    },

    async (request, reply) => {
      const { id } = request.params;
      const chapter = await fastify.chaptersService.getById(id);

      if (!chapter) {
        reply.status(404).send({
          message: "Chapter not found",
        });
      }

      return {
        message: "Chapters",
        data: chapter,
      };
    },
  );
}
