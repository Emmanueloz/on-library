import Type from "typebox";

export const CreateCategoryBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
});

export type CreateCategoryBodyType = Type.Static<typeof CreateCategoryBody>;

export const UpdateCategoryBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
});

export type UpdateCategoryBodyType = Type.Static<typeof UpdateCategoryBody>;
