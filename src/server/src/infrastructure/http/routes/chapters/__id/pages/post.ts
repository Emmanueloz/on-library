import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { ALLOWED_IMAGE_TYPES } from "../../../../../constants/index.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Params: ChapterIdParamsType;
  }>(
    "/",
    {
      schema: {
        tags: ["Pages"],
      },
    },
    async (request, reply) => {
      const { id: idChapter } = request.params;

      const data = await request.file();
      if (!data) {
        return reply.status(400).send({
          message: "Image file is required",
        });
      }

      if (!ALLOWED_IMAGE_TYPES.includes(data.mimetype)) {
        return reply.status(400).send({
          message: "Invalid image type. Allowed: png, jpg, jpeg, webp",
        });
      }

      const pageNumber = parseFloat(data.fields.pageNumber?.value || "0");
      const type = data.fields.type?.value || "image";
      const buffer = await data.toBuffer();

      const page = await fastify.pagesService.createWithImage({
        idChapter,
        pageNumber,
        type,
        fileName: data.filename,
        buffer,
        baseUrl: `${request.protocol}://${request.host}`,
      });

      return {
        message: "Page created",
        data: page,
      };
    },
  );
}
