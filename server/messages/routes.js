import { messageRepository } from './repository.js';

/**
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export async function messageRoutes(fastify) {
    fastify.get(
        '/api/messages',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        offset: { type: 'integer' },
                        limit: { type: 'integer' },
                    },
                    required: ['offset', 'limit'],
                },
            },
        },
        async request => {
            return messageRepository.getMessages(request.query.offset, request.query.limit);
        },
    );

    fastify.post('/messages', async request => {
        const { content, user } = request.body;
        return messageRepository.addMessage(content, user);
    });
}
