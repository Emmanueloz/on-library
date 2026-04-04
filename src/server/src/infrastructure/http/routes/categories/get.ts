import type { FastifyInstance } from "fastify";
import { CategoriesSchema } from "../../schemas/categories/index.ts";
import type { CategoryIdType } from "../../schemas/categories/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Categories"],
      },
    },
    async (request, reply) => {
      const categories = await fastify.categoriesService.query();

      return {
        message: "Categories",
        data: categories,
      };
    },
  );

  fastify.get<{
    Params: CategoryIdType;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Categories"],
        params: CategoriesSchema.Params.CategoryId,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const category = await fastify.categoriesService.getById(id);

      return {
        message: `Categories ${category?.name}`,
        data: category,
      };
    },
  );
}
