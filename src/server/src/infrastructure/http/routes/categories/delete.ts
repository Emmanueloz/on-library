import type { FastifyInstance } from "fastify";
import { CategoriesSchema } from "../../schemas/categories/index.ts";
import type { CategoryIdType } from "../../schemas/categories/params.ts";


export default async function (fastify: FastifyInstance) {
    fastify.delete<{
        Params: CategoryIdType
    }>("/:id", {
        schema: {
            tags: ["Categories"],
            params: CategoriesSchema.Params.CategoryId
        }
    }, async (request, reply) => {
        const { id } = request.params

        reply.log.info(`Deleting category with id: ${id}`)

        await fastify.categoriesService.delete(id)
        return {
            message: "Categories deleted successfully",
        };
    });
}
