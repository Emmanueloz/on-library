import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
    fastify.post("/", {
        schema: {
            tags: ["Users"],
        }
    }, async (request, reply) => {
        return {
            message: "Users",
        };
    });


}
