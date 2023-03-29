import Fastify from 'fastify';
import cors from '@fastify/cors';
import { messageRoutes } from './messages/routes.js';

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
    logger: true,
});

fastify.register(messageRoutes);

await fastify.register(cors, {
    origin: '*',
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server running at ${address}`);
});
