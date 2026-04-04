import Type from "typebox";

export const CreateTagBody = Type.Object({
    name: Type.String({minLength: 1, maxLength: 255}),
});

export type CreateTagBodyType = Type.Static<typeof CreateTagBody>;