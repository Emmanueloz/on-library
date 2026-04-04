import Type from "typebox";

export const CreateSeriesBodySchema = Type.Object({
  title: Type.String({ minLength: 2, maxLength: 200 }),
  description: Type.String({ minLength: 2, maxLength: 1000 }),
  author: Type.String({ minLength: 2, maxLength: 100 }),
  publicationDate: Type.String({ format: "date" }),
  idCategory: Type.String(),
});

export type CreateSeriesBody = Type.Static<typeof CreateSeriesBodySchema>;
