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
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
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
