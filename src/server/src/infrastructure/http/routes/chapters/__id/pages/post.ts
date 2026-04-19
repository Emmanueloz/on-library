import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { ALLOWED_IMAGE_TYPES } from "../../../../../constants/index.ts";
import { type CreatePagesBodyType } from "../../../../schemas/pages/body.ts";

type MultiPageFile = {
  type: "file";
  fieldname?: string;
  filename?: string;
  mimetype?: string;
  encoding?: string;
  toBuffer(): Promise<Buffer>;
};

interface CreateManyPagesBodyType {
  files: MultiPageFile[];
}

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Params: ChapterIdParamsType;
    Body: CreatePagesBodyType;
  }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Pages"],
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
      },
    },
    async (request, reply) => {
      const { id: idChapter } = request.params;

      const data = request.body;
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

  fastify.post<{
    Params: ChapterIdParamsType;
    Body: CreateManyPagesBodyType;
  }>(
    "/batch",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Pages"],
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
      },
    },
    async (request, reply) => {
      const { id: idChapter } = request.params;

      const data = request.body;
      if (!data || !data.files || data.files.length === 0) {
        return reply.status(400).send({
          message: "At least one image file is required",
        });
      }

      const pagesData: Array<{
        pageNumber: number;
        type: string;
        fileName: string;
        buffer: Buffer;
      }> = [];

      for (const file of data.files) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype ?? "")) {
          return reply.status(400).send({
            message: `Invalid image type: ${file.mimetype}. Allowed: png, jpg, jpeg, webp`,
          });
        }

        const fileName = file.filename ?? "unknown";
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
        const pageNumber = parseFloat(nameWithoutExt);

        if (isNaN(pageNumber) || pageNumber < 1) {
          return reply.status(400).send({
            message: `Invalid page number in filename: ${fileName}. Use format: 1.jpg, 2.png, etc.`,
          });
        }

        const buffer = await file.toBuffer();
        pagesData.push({
          pageNumber,
          type: "image",
          fileName,
          buffer,
        });
      }

      pagesData.sort((a, b) => a.pageNumber - b.pageNumber);

      const pages = await fastify.pagesService.createManyWithImages({
        idChapter,
        pages: pagesData,
        baseUrl: `${request.protocol}://${request.host}`,
      });

      return {
        message: "Pages created",
        data: pages,
      };
    },
  );
}