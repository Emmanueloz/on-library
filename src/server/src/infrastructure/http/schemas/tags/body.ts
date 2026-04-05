import Type from "typebox";

export const CreateTagBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
});

export type CreateTagBodyType = Type.Static<typeof CreateTagBody>;

export const UpdateTagBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
});

export type UpdateTagBodyType = Type.Static<typeof UpdateTagBody>;
