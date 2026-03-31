import type { FastifyInstance } from "fastify";

export const errorHandler: FastifyInstance['errorHandler'] = function (error, request, reply) {
    reply.log.error({
        request: {
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body,
            query: request.query,
            params: request.params
        },
        error
    }, 'Unhandled error occurred.');
    return reply
        .code(500)
        .send({ message: "Unhandled error occurred " });
};