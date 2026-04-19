import type { FastifyInstance } from "fastify";
import {
  UpdateProfileBody,
  type UpdateProfileBodyType,
  ChangePasswordBody,
  type ChangePasswordBodyType,
} from "../../../schemas/auth/profile.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{ Body: UpdateProfileBodyType }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: UpdateProfileBody,
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { username, email } = request.body;

      const existingUser = await fastify.authService.getProfile(userId);

      if (!existingUser) {
        return reply.status(404).send({ message: "User not found" });
      }

      if (email) {
        const emailExists = await fastify.authService.emailExists(
          email,
          userId,
        );
        if (emailExists) {
          return reply.status(400).send({ message: "Email already in use" });
        }
      }

      if (username) {
        const usernameExists = await fastify.authService.usernameExists(
          username,
          userId,
        );
        if (usernameExists) {
          return reply.status(400).send({ message: "Username already taken" });
        }
      }

      const updateData: { username?: string; email?: string } = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      const updatedUser = await fastify.authService.updateProfile(
        userId,
        updateData,
      );

      if (!updatedUser) {
        return reply.status(404).send({ message: "User not found" });
      }

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      };
    },
  );

  fastify.put<{ Body: ChangePasswordBodyType }>(
    "/password",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: ChangePasswordBody,
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { oldPassword, newPassword } = request.body;

      const success = await fastify.authService.changePassword(
        userId,
        oldPassword,
        newPassword,
      );

      if (!success) {
        return reply.status(400).send({ message: "Invalid current password" });
      }

      return { message: "Password changed successfully" };
    },
  );
}
