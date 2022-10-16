module.exports = {
  server: {
    api: {
      port: 8001,
      transport: 'http', // http, ws
      framework: 'fastify', // native, fastify, express
    },
    static: {
      port: 8000,
    }
  },
  db: {
    postgres: {
      host: '127.0.0.1',
      port: 5432,
      database: 'example',
      user: 'marcus',
      password: 'marcus',
    },
  },
  sandbox: {
    timeout: 5000,
    displayErrors: false,
  },
};
