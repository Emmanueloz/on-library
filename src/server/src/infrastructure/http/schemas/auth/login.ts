import Type from "typebox";

const LoginSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

type LoginType = Type.Static<typeof LoginSchema>;

export { LoginSchema, type LoginType };
