import type { FastifyInstance } from "fastify";
import { CategoriesSchema } from "../../schemas/categories/index.ts";
import type { CategoryIdType } from "../../schemas/categories/params.ts";
import {
  type UpdateCategoryBodyType,
  UpdateCategoryBody,
} from "../../schemas/categories/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: CategoryIdType;
    Body: UpdateCategoryBodyType;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Categories"],
        params: CategoriesSchema.Params.CategoryId,
        body: UpdateCategoryBody,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;

      const category = await fastify.categoriesService.update(id, {
        name,
      });

      return {
        message: "Categories",
        data: category,
      };
    },
  );
}
