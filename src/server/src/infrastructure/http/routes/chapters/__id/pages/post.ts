import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { ALLOWED_IMAGE_TYPES } from "../../../../../constants/index.ts";
import { type CreatePagesBodyType } from "../../../../schemas/pages/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Params: ChapterIdParamsType;
    Body: CreatePagesBodyType;
  }>(
    "/",
    {
      schema: {
        tags: ["Pages"],
        consumes: ["multipart/form-data"],
      },
    },
    async (request, reply) => {
      const { id: idChapter } = request.params;

      const data = await request.body;
      if (!data) {
        return reply.status(400).send({
          message: "Image file is required",
        });
      }

      if (!ALLOWED_IMAGE_TYPES.includes(data.file.mimetype ?? "")) {
        return reply.status(400).send({
          message: "Invalid image type. Allowed: png, jpg, jpeg, webp",
        });
      }

      const pageNumber = parseFloat(data.pageNumber?.value || "0");
      const type = data.type?.value || "image";
      const buffer = await data.file.toBuffer();

      const page = await fastify.pagesService.createWithImage({
        idChapter,
        pageNumber,
        type,
        fileName: data.file.filename ?? "unknown",
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
