import type { FastifyInstance } from "fastify";
import { SerieId } from "../../schemas/following/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{ Params: { idSerie: string } }>(
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

      await fastify.readingHistoryService.deleteByUserAndSerie(userId, idSerie);
      await fastify.followingService.unfollow(userId, idSerie);

      return reply.status(204).send({
        message: "Serie unfollowed successfully",
      });
    },
  );
}