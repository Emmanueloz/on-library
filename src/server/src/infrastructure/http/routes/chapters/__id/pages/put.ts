import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import type { PageIdParamsType } from "../../../../schemas/pages/params.ts";
import { ALLOWED_IMAGE_TYPES } from "../../../../../constants/index.ts";
import type { UpdatePagesBodyType } from "../../../../schemas/pages/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: ChapterIdParamsType & PageIdParamsType;
    Body: UpdatePagesBodyType;
  }>(
    "/:pageId",
    {
      schema: {
        tags: ["Pages"],
      },
    },
    async (request, reply) => {
      const { pageId, id: idChapter } = request.params;

      const existingPage = await fastify.pagesService.getById(pageId);
      if (!existingPage) {
        return reply.status(404).send({
          message: "Page not found",
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
        id: pageId,
      };

      if (pageNumberInput !== undefined)
        params.newPageNumber = parseFloat(pageNumberInput);
      if (typeInput) params.newType = typeInput;
      if (fileData) {
        params.newFileName = fileData.filename;
        params.newBuffer = await fileData.toBuffer();
        params.oldUrl = existingPage.url;
        params.baseUrl = `${request.protocol}://${request.host}`;
      }

      const page = await fastify.pagesService.updateWithImage(params);
      return {
        message: "Page updated",
        data: page,
      };
    },
  );
}
