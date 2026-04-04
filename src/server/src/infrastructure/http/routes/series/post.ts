import type { FastifyInstance } from "fastify";
import {
  CreateSeriesBodySchema,
  type CreateSeriesBody,
} from "../../schemas/series/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateSeriesBody;
  }>(
    "/",
    {
      schema: {
        tags: ["Series"],
        body: CreateSeriesBodySchema,
      },
    },
    async (request, reply) => {
      const { title, description, author, publicationDate, idCategory } =
        request.body;

      const series = await fastify.seriesService.create({
        title,
        description,
        author,
        publicationDate: new Date(publicationDate),
        idCategory,
      });

      return {
        message: "Series created successfully",
        data: series,
      };
    },
  );
}
