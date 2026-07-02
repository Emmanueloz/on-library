import type { FastifyInstance } from "fastify";
import {
  CreateChapterBodySchema,
  type CreateChapterBody,
} from "../../schemas/chapters/body.ts";

const ALLOWED_IMPORT_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_IMPORT_SIZE = 10 * 1024 * 1024;

type ImportFileField = {
  type: "file";
  fieldname?: string;
  filename?: string;
  mimetype?: string;
  encoding?: string;
  toBuffer(): Promise<Buffer>;
};

type ImportTextField = {
  type: "field";
  value: string;
};

interface ImportChaptersBodyType {
  file: ImportFileField;
  idSeries: ImportTextField;
}

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateChapterBody;
  }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Chapters"],
        security: [{ bearerAuth: [] }],
        body: CreateChapterBodySchema,
      },
    },
    async (request, reply) => {
      const { title, number, idSeries, groupNum, groupTitle } = request.body;

      console.log("Received request to create chapter:", request.body);

      const chapter = await fastify.chaptersService.create({
        title,
        number,
        idSeries,
        groupNum: groupNum ?? null,
        groupTitle: groupTitle ?? null,
      });

      return {
        message: "Create Chapter",
        data: chapter,
      };
    },
  );

  fastify.post<{
    Body: ImportChaptersBodyType;
  }>(
    "/import",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Chapters"],
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
      },
    },
    async (request, reply) => {
      const data = request.body;
      if (!data || !data.file) {
        return reply.status(400).send({ message: "File is required" });
      }

      if (!ALLOWED_IMPORT_TYPES.includes(data.file.mimetype ?? "")) {
        return reply.status(400).send({
          message: "Invalid file type. Allowed: CSV, XLS, XLSX",
        });
      }

      const idSeries = data.idSeries?.value;
      if (!idSeries) {
        return reply.status(400).send({ message: "idSeries is required" });
      }

      const buffer = await data.file.toBuffer();
      if (buffer.length > MAX_IMPORT_SIZE) {
        return reply.status(400).send({
          message: "File too large. Maximum size is 10MB",
        });
      }

      try {
        const created = await fastify.chaptersService.importChapters(buffer, idSeries);
        return {
          message: `${created.length} chapters imported`,
          data: created,
        };
      } catch (err) {
        return reply.status(400).send({
          message: err instanceof Error ? err.message : "Error importing chapters",
        });
      }
    },
  );
}