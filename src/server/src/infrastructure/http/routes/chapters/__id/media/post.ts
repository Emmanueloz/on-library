import type { FastifyInstance } from "fastify";
import type { ChapterIdParamsType } from "../../../../schemas/chapters/params.ts";
import { ALLOWED_IMAGE_TYPES, ALLOWED_EPUB_TYPES } from "../../../../../constants/index.ts";
import type { CreateMediaBodyType } from "../../../../schemas/media/body.ts";
import { MediaType } from "@on-library/shared";

type MultiMediaFile = {
  type: "file";
  fieldname?: string;
  filename?: string;
  mimetype?: string;
  encoding?: string;
  toBuffer(): Promise<Buffer>;
};

interface CreateManyMediaBodyType {
  files: MultiMediaFile[];
}

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Params: ChapterIdParamsType;
    Body: CreateMediaBodyType;
  }>(
    "/",
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
      if (!data) {
        return reply.status(400).send({
          message: "File is required",
        });
      }

      if (!ALLOWED_IMAGE_TYPES.includes(data.file.mimetype ?? "")) {
        return reply.status(400).send({
          message: "Invalid image type. Allowed: png, jpg, jpeg, webp",
        });
      }

      const pageNumber = parseFloat(data.pageNumber?.value || "0");

      const media = await fastify.pagesService.createWithImage({
        idChapter,
        pageNumber,
        type: MediaType.IMAGE,
        fileName: data.file.filename ?? "unknown",
        buffer: await data.file.toBuffer(),
        baseUrl: `${request.protocol}://${request.host}`,
      });

      return {
        message: "Media created",
        data: media,
      };
    },
  );

  fastify.post<{
    Params: ChapterIdParamsType;
    Body: CreateManyMediaBodyType;
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
      if (!data || !data.files) {
        return reply.status(400).send({
          message: "At least one image file is required",
        });
      }

      const files = Array.isArray(data.files) ? data.files : [data.files];
      if (files.length === 0) {
        return reply.status(400).send({
          message: "At least one image file is required",
        });
      }

      const pagesData: Array<{
        pageNumber: number;
        type: MediaType;
        fileName: string;
        buffer: Buffer;
      }> = [];

      for (const file of files) {
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
          type: MediaType.IMAGE,
          fileName,
          buffer,
        });
      }

      pagesData.sort((a, b) => a.pageNumber - b.pageNumber);

      const media = await fastify.pagesService.createManyWithImages({
        idChapter,
        pages: pagesData,
        
        baseUrl: `${request.protocol}://${request.host}`,
      });

      return {
        message: "Media created",
        data: media,
      };
    },
  );

  fastify.post<{
    Params: ChapterIdParamsType;
    Body: {
      file: {
        filename?: string;
        mimetype?: string;
        toBuffer(): Promise<Buffer>;
      };
    };
  }>(
    "/epub",
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
      if (!data || !data.file) {
        return reply.status(400).send({
          message: "EPUB file is required",
        });
      }

      if (!ALLOWED_EPUB_TYPES.includes(data.file.mimetype ?? "")) {
        const fileName = data.file.filename ?? "";
        if (!fileName.endsWith(".epub")) {
          return reply.status(400).send({
            message: "Invalid file type. Only EPUB files are allowed",
          });
        }
      }

      const buffer = await data.file.toBuffer();
      const media = await fastify.pagesService.createWithEpub({
        idChapter,
        fileName: data.file.filename ?? "chapter.epub",
        buffer,
        baseUrl: `${request.protocol}://${request.host}`,
      });

      return {
        message: "EPUB uploaded",
        data: media,
      };
    },
  );
}
