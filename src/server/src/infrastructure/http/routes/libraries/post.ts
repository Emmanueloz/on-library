import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Libraries"],
      },
    },
    async (request, reply) => {
      return {
        message: "Libraries",
      };
    },
  );

  fastify.post("/:id/serie", {}, async (request, reply) => {
    return {
      message: "",
    };
  });
}
