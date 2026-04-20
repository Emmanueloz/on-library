import { Type } from "typebox";
import type { Static } from "typebox";

export const UserId = Type.Object({
  id: Type.String(),
});

export type UserIdType = Static<typeof UserId>;

export const UserPermissionsBody = Type.Object({
  permissions: Type.Array(
    Type.Object({
      module: Type.String(),
      type: Type.Union([
        Type.Literal("READ"),
        Type.Literal("WRITE"),
        Type.Literal("DELETE"),
      ]),
    }),
  ),
});

export type UserPermissionsBodyType = Static<typeof UserPermissionsBody>;

export const DeletePermissionsBody = Type.Readonly(UserPermissionsBody);

export type DeletePermissionsBodyType = Static<typeof DeletePermissionsBody>;

export const ResetPasswordBody = Type.Object({
  newPassword: Type.String({ minLength: 6 }),
});

export type ResetPasswordBodyType = Static<typeof ResetPasswordBody>;
