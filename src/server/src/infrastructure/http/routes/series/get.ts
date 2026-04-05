import type { FastifyInstance } from "fastify";
import { SeriesSchema } from "../../schemas/series/index.ts";
import type {
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
