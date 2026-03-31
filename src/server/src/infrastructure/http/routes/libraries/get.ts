import type { FastifyInstance } from "fastify";
import { LibrariesSchema } from "../../schemas/libraries/index.ts";
import type { LibraryIdType } from "../../schemas/libraries/params.ts";


export default async function (fastify: FastifyInstance) {
    fastify.get("/", {
        schema: {
            tags: ["Libraries"],
        }
    }, async (request, reply) => {
        return {
            message: "Libraries",
        };
    });

    fastify.get<{
        Params: LibraryIdType
    }>("/:id", {
        schema: {
            tags: ["Libraries"],
            params: LibrariesSchema.Params.LibraryId
        }
    }, async (request, reply) => {

        const { id } = request.params

        return {
            message: `Libraries ${id}`,
        };
    });
}
