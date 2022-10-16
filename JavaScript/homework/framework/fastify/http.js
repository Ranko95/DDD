module.exports = (routing, port) => {
  const fastify = require('fastify')({ logger: false });
  const cors = require('@fastify/cors');

  for (const service in routing) {
    for (const method in routing[service]) {
      const route = {
        method: 'POST',
        url: `/api/${service}/${method}`,
        handler: async (request) => {
          const { args } = request.body;
          const handler = routing[service][method];
          const result = await handler(...args);
          return result.rows;
        },
      }

      fastify.route(route);
    }
  }

  const start = async () => {
    try {
      await fastify.register(cors, {
        origin: '*',
      });
      await fastify.listen({ port });
      console.log(`Fastify server listening on port ${port}`);
    } catch (err) {
      process.exit(1);
    }
  }
  
  start();
};
