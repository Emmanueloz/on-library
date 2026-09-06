import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { detectMediaType, MediaType } from "@on-library/shared";
import type { CreateMediaBatchBodyType } from "../../../../schemas/media/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Params: ChapterIdParamsType;
    Body: CreateMediaBatchBodyType;
  }>(
    "/batch",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
      },
    },
    async (request, reply) => {
      const { id: idChapter } = request.params;

      const data = request.body;
      const files = !data?.files
        ? []
        : Array.isArray(data.files)
          ? data.files
          : [data.files];

      if (files.length === 0) {
        return reply.status(400).send({
          message: "At least one file is required",
        });
      }

      const filesData: Array<{
        pageNumber: number;
        type: MediaType;
        fileName: string;
        buffer: Buffer;
      }> = [];
      let batchType: MediaType | null = null;

      for (const file of files) {
        const fileName = file.filename ?? "unknown";
        const type = detectMediaType(file.mimetype ?? "", fileName);

        if (!type) {
          return reply.status(400).send({
            message: `Unsupported file type: ${fileName}. Allowed: images (png, jpg, jpeg, webp), EPUB or PDF`,
          });
        }

        if (batchType && type !== batchType) {
          return reply.status(400).send({
            message:
              "Mixed file types are not allowed. Upload only images or a single document (EPUB/PDF) per request",
          });
        }
        batchType = type;

        let pageNumber = 0;
        if (type === MediaType.IMAGE) {
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
          pageNumber = parseFloat(nameWithoutExt);

          if (isNaN(pageNumber) || pageNumber < 1) {
            return reply.status(400).send({
              message: `Invalid page number in filename: ${fileName}. Use format: 1.jpg, 2.png, etc.`,
            });
          }
        }

        filesData.push({
          pageNumber,
          type,
          fileName,
          buffer: await file.toBuffer(),
        });
      }

      if (
        (batchType === MediaType.EPUB || batchType === MediaType.PDF) &&
        filesData.length > 1
      ) {
        return reply.status(400).send({
          message: `Only one ${batchType} file is allowed per request`,
        });
      }

      const chapterMediaType =
        await fastify.mediaService.getChapterMediaType(idChapter);

      if (
        chapterMediaType === MediaType.EPUB ||
        chapterMediaType === MediaType.PDF
      ) {
        return reply.status(409).send({
          message: `This chapter already contains ${chapterMediaType} media. Only one document file is allowed per chapter`,
        });
      }

      if (
        chapterMediaType === MediaType.IMAGE &&
        (batchType === MediaType.EPUB || batchType === MediaType.PDF)
      ) {
        return reply.status(409).send({
          message:
            "This chapter already contains images. Only image files can be uploaded",
        });
      }

      filesData.sort((a, b) => a.pageNumber - b.pageNumber);

      const media = await fastify.mediaService.createManyWithFiles({
        idChapter,
        files: filesData,
        baseUrl: `${request.protocol}://${request.host}`,
      });

      return {
        message: "Media created",
        data: media,
      };
    },
  );
}
