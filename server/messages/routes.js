import { messageRepository } from './repository.js';

/**
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export async function messageRoutes(fastify) {
    fastify.get(
        '/messages',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer' },
                        pageSize: { type: 'integer' },
                    },
                    required: ['page', 'pageSize'],
                },
            },
        },
        async request => {
            return messageRepository.getMessages(request.query.page, request.query.pageSize || 50);
        },
    );

    fastify.post('/messages', async request => {
        const { content, user } = request.body;
        return messageRepository.addMessage(content, user);
    });
}
