import type { FastifyInstance } from "fastify";
import { TagsSchema } from "../../schemas/tags/index.ts";
import type { TagIdType } from "../../schemas/tags/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{
    Params: TagIdType;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Tags"],
        params: TagsSchema.Params.TagId,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      await fastify.tagsService.delete(id);

      return {
        message: "Tag deleted",
      };
    },
  );
}
