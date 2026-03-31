import type { FastifyInstance } from "fastify";
import { SeriesSchema } from "../../schemas/series/index.ts";
import type { SerieIdType } from "../../schemas/series/params.ts";


export default async function (fastify: FastifyInstance) {
    fastify.put<{
        Params: SerieIdType
    }>("/:id", {
        schema: {
            tags: ["Series"],
            params: SeriesSchema.Params.SerieId
        }
    }, async (request, reply) => {
        const { id } = request.params
        return {
            message: "Series",
        };
    });
}   