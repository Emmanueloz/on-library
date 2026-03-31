import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
    fastify.post("/", {
        schema: {
            tags: ["Categories"],
        }
    }, async (request, reply) => {
        return {
            message: "Categories",
        };
    });


}
