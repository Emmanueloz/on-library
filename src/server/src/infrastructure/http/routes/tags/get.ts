import type { FastifyInstance } from "fastify";
import { TagsSchema } from "../../schemas/tags/index.ts";
import type { TagIdType } from "../../schemas/tags/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Tags"],
      },
    },
    async (request, reply) => {
      const tags = await fastify.tagsService.query();
      console.log(tags);

      return {
        message: "Tags",
        data: tags,
      };
    },
  );

  fastify.get<{
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

      const tag = await fastify.tagsService.getById(id);

      return {
        message: `Tags ${tag?.name}`,
        data: tag,
      };
    },
  );
}
