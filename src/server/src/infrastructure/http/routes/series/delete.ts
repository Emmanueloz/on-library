import type { FastifyInstance } from "fastify";
import { SeriesSchema } from "../../schemas/series/index.ts";
import type { SerieIdType } from "../../schemas/series/params.ts";
import Type from "typebox";

const RemoveTagsBodySchema = Type.Object({
  tags: Type.Array(Type.String()),
});

type RemoveTagsBody = Type.Static<typeof RemoveTagsBodySchema>;

export default async function (fastify: FastifyInstance) {
    fastify.delete<{
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

    fastify.delete<{
        Params: SerieIdType;
        Body: RemoveTagsBody;
    }>("/:id/tags", {
        schema: {
            tags: ["Series"],
            params: SeriesSchema.Params.SerieId,
            body: RemoveTagsBodySchema,
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const { tags } = request.body;

        await fastify.seriesService.removeTags(id, tags);

        return {
            message: "Tags removed successfully",
        };
    });
}