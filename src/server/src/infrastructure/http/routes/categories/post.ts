import type { FastifyInstance } from "fastify";
import {
  CreateCategoryBody,
  type CreateCategoryBodyType,
} from "../../schemas/categories/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateCategoryBodyType;
  }>(
    "/",
    {
      schema: {
        tags: ["Categories"],
        body: CreateCategoryBody,
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      const category = await fastify.categoriesService.create({ name });

      return {
        message: "Categories",
        data: category,
      };
    },
  );
}
