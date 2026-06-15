import type { FastifyInstance } from "fastify";
import {
  UpdateLibraryBody,
  type UpdateLibraryBodyType,
} from "../../schemas/libraries/body.ts";
import {
  LibraryId,
  type LibraryIdType,
} from "../../schemas/libraries/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{ Params: LibraryIdType; Body: UpdateLibraryBodyType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        security: [{ bearerAuth: [] }],
        params: LibraryId,
        body: UpdateLibraryBody,
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { id } = request.params;
      const { name, isPublic } = request.body;

      const library = await fastify.librariesService.getByIdAndUserId(
        id,
        userId,
      );

      if (!library) {
        return reply
          .status(404)
          .send({ message: "Library not found or not owned by user" });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (isPublic !== undefined) updateData.isPublic = isPublic;

      const updatedLibrary = await fastify.librariesService.update(
        id,
        updateData,
      );

      return {
        message: "Update library",
        data: updatedLibrary,
      };
    },
  );
}
