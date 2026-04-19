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
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Series"],
        security: [{ bearerAuth: [] }],
        body: CreateSeriesBodySchema,
      },
    },
    async (request, reply) => {
      const {
        title,
        pictureUrl,
        description,
        author,
        publicationDate,
        idCategory,
        tags,
      } = request.body;

      const series = await fastify.seriesService.create({
        title,
        pictureUrl,
        description,
        author,
        publicationDate: new Date(publicationDate),
        idCategory,
        tags: tags || [],
      });

      return {
        message: "Series created successfully",
        data: series,
      };
    },
  );
}