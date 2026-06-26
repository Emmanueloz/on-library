import type { FastifyInstance } from "fastify";
import type { IChapter } from "@on-library/shared";
import {
  ChapterIdParams,
  type ChapterIdParamsType,
} from "../../../schemas/chapters/params.ts";
import {
  UpdateChapterBodySchema,
  type UpdateChapterBody,
} from "../../../schemas/chapters/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: ChapterIdParamsType;
    Body: UpdateChapterBody;
  }>(
    "",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Chapters"],
        security: [{ bearerAuth: [] }],
        params: ChapterIdParams,
        body: UpdateChapterBodySchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { title, number, groupNum, groupTitle } = request.body;

      const data: Partial<IChapter> = { title };
      if (number !== undefined) data.number = number;
      if (groupNum !== undefined) data.groupNum = groupNum;
      if (groupTitle !== undefined) data.groupTitle = groupTitle;

      const chapter = await fastify.chaptersService.update(id, data);

      return {
        message: "Update Chapter",
        data: chapter,
      };
    },
  );
}