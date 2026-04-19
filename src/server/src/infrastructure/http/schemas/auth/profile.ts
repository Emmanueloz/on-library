import Type from "typebox";
import type { Static } from "typebox";

export const UpdateProfileBody = Type.Object({
  username: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: "email" })),
});

export type UpdateProfileBodyType = Static<typeof UpdateProfileBody>;

export const ChangePasswordBody = Type.Object({
  oldPassword: Type.String({ minLength: 6 }),
  newPassword: Type.String({ minLength: 6 }),
});

export type ChangePasswordBodyType = Static<typeof ChangePasswordBody>;