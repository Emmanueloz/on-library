import type { FastifyInstance } from "fastify";
import { TagsSchema } from "../../schemas/tags/index.ts";
import type { TagIdType } from "../../schemas/tags/params.ts";


export default async function (fastify: FastifyInstance) {
    fastify.put<{
        Params: TagIdType
    }>("/:id", {
        schema: {
            tags: ["Tags"],
            params: TagsSchema.Params.TagId
        }
    }, async (request, reply) => {
        const { id } = request.params
        return {
            message: "Tags",
        };
    });
}   
