import type { FastifyInstance } from "fastify";
import type { IUser } from "@on-library/shared";
import {
  UserId,
  type UserIdType,
  CreateUserBody,
  type CreateUserBodyType,
  UpdateUserBody,
  type UpdateUserBodyType,
  UserPermissionsBody,
  type UserPermissionsBodyType,
  ResetPasswordBody,
  type ResetPasswordBodyType,
} from "../../schemas/users/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Params: UserIdType }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const users = await fastify.usersService.findAll();
      return users;
    },
  );

  fastify.get<{ Params: UserIdType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return user;
    },
  );

  fastify.post<{ Body: CreateUserBodyType }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        body: CreateUserBody,
      },
    },
    async (request, reply ) => {
      const { username, email, password } = request.body;

      const newUser = await fastify.authService.register({
        username,
        email,
        password,
      });

      return reply.status(201).send(newUser);
    },
  );

  fastify.put<{ Params: UserIdType; Body: UpdateUserBodyType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        params: UserId,
        security: [{ bearerAuth: [] }],
        body: UpdateUserBody,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { username, email } = request.body;

      const updateData: Partial<IUser> = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      const user = await fastify.usersService.update(id, updateData);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return user;
    },
  );

  fastify.delete<{ Params: UserIdType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
      },
    },
    async (request, reply ) => {
      const { id } = request.params;
      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      await fastify.usersService.delete(id);

      return reply.status(204).send();
    },
  );

  fastify.put<{ Params: UserIdType; Body: UserPermissionsBodyType }>(
    "/:id/permissions",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
        body: UserPermissionsBody,
      },
    },
    async (request, reply ) => {
      const { id } = request.params;
      const { permissions } = request.body;

      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      await fastify.usersService.setPermissions(id, permissions);
      const updatedPermissions = await fastify.usersService.getPermissions(id);

      return {
        id: user.id,
        username: user.username,
        permissions: updatedPermissions,
      };
    },
  );

  fastify.post<{ Params: UserIdType; Body: ResetPasswordBodyType }>(
    "/:id/reset-password",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
        body: ResetPasswordBody,
      },
    },
    async (request, reply   ) => {
      const { id } = request.params;
      const { newPassword } = request.body;

      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      await fastify.usersService.resetPassword(id, newPassword);

      return { message: "Password updated successfully" };
    },
  );

  fastify.get<{ Params: UserIdType }>(
    "/:id/libraries",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const libraries = await fastify.usersService.getLibraries(id);

      return libraries;
    },
  );
}
