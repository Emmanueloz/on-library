import type { FastifyInstance } from "fastify";
import { TagsSchema } from "../../schemas/tags/index.ts";
import type { TagIdType } from "../../schemas/tags/params.ts";
import {
  type UpdateTagBodyType,
  UpdateTagBody,
} from "../../schemas/tags/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: TagIdType;
    Body: UpdateTagBodyType;
  }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Tags"],
        security: [{ bearerAuth: [] }],
        params: TagsSchema.Params.TagId,
        body: UpdateTagBody,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;

      const updatedTag = await fastify.tagsService.update(id, { name });
      return {
        message: "Tags",
        data: updatedTag,
      };
    },
  );
}