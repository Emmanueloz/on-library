import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import type { MediaIdParamsType } from "../../../../schemas/media/params.ts";
import { ALLOWED_IMAGE_TYPES } from "../../../../../constants/index.ts";
import type { UpdateMediaBodyType } from "../../../../schemas/media/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: ChapterIdParamsType & MediaIdParamsType;
    Body: UpdateMediaBodyType;
  }>(
    "/:mediaId",
    {
      onRequest: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Media"],
      },
    },
    async (request, reply) => {
      const { mediaId, id: idChapter } = request.params;

      const existingMedia = await fastify.pagesService.getById(mediaId);
      if (!existingMedia) {
        return reply.status(404).send({
          message: "Media not found",
        });
      }

      const fileData = request.body.file;
      const pageNumberInput = request.body.pageNumber?.value;
      const typeInput = request.body.type?.value;

      if (fileData && !ALLOWED_IMAGE_TYPES.includes(fileData.mimetype ?? "")) {
        return reply.status(400).send({
          message: "Invalid image type. Allowed: png, jpg, jpeg, webp",
        });
      }

      const params: any = {
        id: mediaId,
      };

      if (pageNumberInput !== undefined)
        params.newPageNumber = parseFloat(pageNumberInput);
      if (typeInput) params.newType = typeInput;
      if (fileData) {
        params.newFileName = fileData.filename;
        params.newBuffer = await fileData.toBuffer();
        params.oldUrl = existingMedia.url;
        params.baseUrl = `${request.protocol}://${request.host}`;
      }

      const media = await fastify.pagesService.updateWithImage(params);
      return {
        message: "Media updated",
        data: media,
      };
    },
  );
}
