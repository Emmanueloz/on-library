import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import type { PageIdParamsType } from "../../../../schemas/pages/params.ts";
import { ALLOWED_IMAGE_TYPES } from "../../../../../constants/index.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: ChapterIdParamsType & PageIdParamsType;
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

      let fileData = null;
      let pageNumberInput: string | undefined;
      let typeInput: string | undefined;

      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === "file") {
          fileData = part;
        } else if (part.type === "field") {
          if (part.fieldname === "pageNumber") {
            pageNumberInput = String(part.value);
          }
          if (part.fieldname === "type") {
            typeInput = String(part.value);
          }
        }
      }

      if (fileData && !ALLOWED_IMAGE_TYPES.includes(fileData.mimetype ?? "")) {
        return reply.status(400).send({
          message: "Invalid image type. Allowed: png, jpg, jpeg, webp",
        });
      }

      const page = await fastify.pagesService.updateWithImage({
        id: pageId,
        newPageNumber: pageNumberInput !== undefined ? parseFloat(pageNumberInput) : undefined,
        newType: typeInput,
        newFileName: fileData?.filename,
        newBuffer: fileData ? await fileData.toBuffer() : undefined,
        oldUrl: existingPage.url,
        baseUrl: `${request.protocol}://${request.host}`,
      });

      return {
        message: "Page updated",
        data: page,
      };
    },
  );
}
