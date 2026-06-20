import type { FastifyInstance } from "fastify";
import { SerieId } from "../../schemas/following/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Params: { idSerie: string } }>(
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

      const serie = await fastify.seriesService.getById(idSerie);

      if (!serie) {
        return reply.status(404).send({ message: "Serie not found" });
      }

      const alreadyFollowing = await fastify.followingService.isFollowing(
        userId,
        idSerie,
      );

      if (alreadyFollowing) {
        return reply.status(409).send({ message: "Already following this serie" });
      }

      await fastify.followingService.follow(userId, idSerie);

      return reply.status(201).send({
        message: "Serie followed successfully",
      });
    },
  );
}