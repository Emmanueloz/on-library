import type { FastifyInstance } from "fastify";
import { CreateLibraryBody, type CreateLibraryBodyType } from "../../schemas/libraries/body.ts";
import { AddSeriesBody, type AddSeriesBodyType } from "../../schemas/libraries/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: CreateLibraryBodyType }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        security: [{ bearerAuth: [] }],
        body: CreateLibraryBody,
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { name, isPublic } = request.body;

      const library = await fastify.librariesService.create({
        name,
        idUser: userId,
        isPublic: isPublic ?? false,
      });

      return reply.status(201).send(library);
    }
  );

  fastify.post<{ Params: { id: string }; Body: AddSeriesBodyType }>(
    "/:id/serie",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        body: AddSeriesBody,
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { id } = request.params;
      const { idSerie } = request.body;

      const library = await fastify.librariesService.getByIdAndUserId(
        id,
        userId,
      );

      if (!library) {
        return reply
          .status(404)
          .send({ message: "Library not found or not owned by user" });
      }

      const serieExists = await fastify.librariesService.existsSerie(idSerie);

      if (!serieExists) {
        return reply.status(404).send({ message: "Serie not found" });
      }

      await fastify.librariesService.addSerie(id, idSerie);

      return reply.status(201).send({ message: "Serie added to library" });
    },
  );
}