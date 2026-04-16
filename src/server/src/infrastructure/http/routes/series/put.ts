import type { FastifyInstance } from "fastify";
import { SeriesSchema } from "../../schemas/series/index.ts";
import type { SerieIdType } from "../../schemas/series/params.ts";
import {
  UpdateSeriesBodySchema,
  type UpdateSeriesBody,
} from "../../schemas/series/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: SerieIdType;
    Body: UpdateSeriesBody;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Series"],
        params: SeriesSchema.Params.SerieId,
        body: UpdateSeriesBodySchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const {
        title,
        description,
        pictureUrl,
        author,
        idCategory,
        publicationDate,
        tags,
      } = request.body;

      const data: any = {};
      if (title) data.title = title;
      if (pictureUrl) data.pictureUrl = pictureUrl;
      if (description) data.description = description;
      if (author) data.author = author;
      if (publicationDate) data.publicationDate = publicationDate;
      if (idCategory) data.idCategory = idCategory;
      if (tags) data.tags = tags;

      const serie = await fastify.seriesService.update(id, data);

      return {
        message: "Series",
        data: serie,
      };
    },
  );
}
