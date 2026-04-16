import Type from "typebox";

export const CreateSeriesBodySchema = Type.Object({
  title: Type.String({ minLength: 2, maxLength: 200 }),
  pictureUrl: Type.String({ minLength: 2, maxLength: 200 }),
  description: Type.String({ minLength: 2, maxLength: 1000 }),
  author: Type.String({ minLength: 2, maxLength: 100 }),
  publicationDate: Type.String({ format: "date" }),
  idCategory: Type.String(),
  tags: Type.Array(Type.String()),
});

export type CreateSeriesBody = Type.Static<typeof CreateSeriesBodySchema>;

export const UpdateSeriesBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 2, maxLength: 200 })),
  pictureUrl: Type.Optional(Type.String({ minLength: 2, maxLength: 200 })),
  description: Type.Optional(Type.String({ minLength: 2, maxLength: 1000 })),
  author: Type.Optional(Type.String({ minLength: 2, maxLength: 100 })),
  publicationDate: Type.Optional(Type.String({ format: "date" })),
  idCategory: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
});

export type UpdateSeriesBody = Type.Static<typeof UpdateSeriesBodySchema>;
