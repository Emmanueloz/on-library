import type { FastifyInstance } from "fastify";
import Type from "typebox";
import { SeriesSchema } from "../../schemas/series/index.ts";
import type {
  SerieIdType,
} from "../../schemas/series/params.ts";

const RecentSeriesQuery = Type.Object({
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 12 })),
});

type RecentSeriesQueryType = Type.Static<typeof RecentSeriesQuery>;

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
    Querystring: RecentSeriesQueryType;
  }>(
    "/recent",
    {
      schema: {
        tags: ["Series"],
        querystring: RecentSeriesQuery,
      },
    },
    async (request, reply) => {
      const limit = request.query.limit ?? 12;
      const series = await fastify.seriesService.getRecent(limit);

      return {
        message: "Recent series",
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
      const series = await fastify.seriesService.getById(id);

      if (!series) {
        return reply.status(404).send({
          message: "Series not found",
        });
      }
      return {
        message: `Series ${series.title}`,
        data: series,
      };
    },
  );
}
