import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Chapters"],
      },
    },
    async (request, reply) => {
      // Implementation for getting pages of a chapter
    },
  );
}
