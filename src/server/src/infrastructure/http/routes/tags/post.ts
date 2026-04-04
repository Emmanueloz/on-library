import type { FastifyInstance } from "fastify";
import { CreateTagBody, type CreateTagBodyType } from "../../schemas/tags/body.ts";

export default async function (fastify: FastifyInstance) {
    fastify.post<{
        Body: CreateTagBodyType
    }>("/", {
        schema: {
            tags: ["Tags"],
            body: CreateTagBody
        }
    }, async (request, reply) => {

        const { name } = request.body;

        const tags = await fastify.tagsServices.create({ name });
        return  reply.status(201).send({
            message: "Tag created",
            data: tags
        });
    });


}
