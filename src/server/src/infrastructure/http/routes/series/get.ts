import type { FastifyInstance } from "fastify";
import { SeriesSchema } from "../../schemas/series/index.ts";
import type {
  SerieIdChaptersType,
  SerieIdType,
} from "../../schemas/series/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Series"],
      },
    },
    async (request, reply) => {
      const series = await fastify.seriesService.query();

      return {
        message: "Series",
        data: series,
      };
    },
  );

  fastify.get<{
    Params: SerieIdType;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Series"],
        params: SeriesSchema.Params.SerieId,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      return {
        message: `Series ${id}`,
      };
    },
  );

  fastify.get<{
    Params: SerieIdType;
  }>(
    "/:id/chapters",
    {
      schema: {
        tags: ["Series"],
        params: SeriesSchema.Params.SerieId,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      return {
        message: `Series ${id}`,
      };
    },
  );

  fastify.get<{
    Params: SerieIdChaptersType;
  }>(
    "/:id/chapters/:chapterNumber",
    {
      schema: {
        tags: ["Series"],
        params: SeriesSchema.Params.SerieIdChapters,
      },
    },
    async (request, reply) => {
      const { id, chapterNumber } = request.params;

      return {
        message: `Series ${id} Capitulo ${chapterNumber}`,
      };
    },
  );
}
