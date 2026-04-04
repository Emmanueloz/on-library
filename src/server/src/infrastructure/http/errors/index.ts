import type { FastifyInstance } from "fastify";

export const errorHandler: FastifyInstance["errorHandler"] = function (
  error,
  request,
  reply,
) {
  console.error(error);
  console.log(typeof error);

  reply.log.error(
    {
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        query: request.query,
        params: request.params,
      },
      error,
    },
    "Unhandled error occurred.",
  );

  if (
    error instanceof Error &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return reply.code(error.statusCode).send(error);
  }

  return reply.code(500).send({ message: "Unhandled error occurred " });
};
