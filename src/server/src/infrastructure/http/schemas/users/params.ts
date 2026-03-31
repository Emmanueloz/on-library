import Type from "typebox";

export const UserId = Type.Object({
    id: Type.String(),
});

export type UserIdType = Type.Static<typeof UserId>;
