import Fastify from 'fastify';
import { messageRoutes } from './messages/routes.js';

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
    logger: true,
});

fastify.register(messageRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server running at ${address}`);
});
