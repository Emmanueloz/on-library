import type { FastifyInstance } from "fastify";
import { SerieId } from "../../schemas/following/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Following"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;

      const following = await fastify.followingService.getByUserId(userId);

      return {
        message: "Get following series success",
        data: following,
      };
    },
  );

  fastify.get<{ Params: { idSerie: string } }>(
    "/:idSerie",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Following"],
        params: SerieId,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { idSerie } = request.params;

      const following = await fastify.followingService.getByUserIdAndSerieId(
        userId,
        idSerie,
      );

      if (!following) {
        return reply.status(404).send({
          message: "Not following this serie",
        });
      }

      return {
        message: "Get following serie success",
        data: following,
      };
    },
  );
}