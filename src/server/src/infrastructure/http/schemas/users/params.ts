import { Type } from "typebox";
import type { Static } from "typebox";

export const UserId = Type.Object({
    id: Type.String(),
});

export type UserIdType = Static<typeof UserId>;

export const CreateUserBody = Type.Object({
    username: Type.String(),
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 6 }),
});

export type CreateUserBodyType = Static<typeof CreateUserBody>;

export const UpdateUserBody = Type.Object({
    username: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: "email" })),
});

export type UpdateUserBodyType = Static<typeof UpdateUserBody>;

export const UserPermissionsBody = Type.Object({
    permissions: Type.Array(
        Type.Object({
            module: Type.String(),
            type: Type.Union([Type.Literal("READ"), Type.Literal("WRITE"), Type.Literal("DELETE")]),
        })
    ),
});

export type UserPermissionsBodyType = Static<typeof UserPermissionsBody>;

export const ResetPasswordBody = Type.Object({
    newPassword: Type.String({ minLength: 6 }),
});

export type ResetPasswordBodyType = Static<typeof ResetPasswordBody>;