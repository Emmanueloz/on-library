import type { FastifyInstance } from "fastify";
import { UsersSchema } from "../../schemas/users/index.ts";
import type { UserIdType } from "../../schemas/users/params.ts";


export default async function (fastify: FastifyInstance) {
    fastify.delete<{
        Params: UserIdType
    }>("/:id", {
        schema: {
            tags: ["Users"],
            params: UsersSchema.Params.UserId
        }
    }, async (request, reply) => {
        const { id } = request.params
        return {
            message: "Users",
        };
    });
}
