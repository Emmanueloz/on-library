import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;

      const user = await fastify.authService.getProfile(userId);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        permissions: user.userPermissions,
      };
    },
  );
}
