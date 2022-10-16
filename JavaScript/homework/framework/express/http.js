const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=UTF-8',
};

module.exports = (routing, port) => {
  const express = require('express');

  const app = express();

  app.use(express.json());
  app.use((_, res, next) => {
    for (const header in HEADERS) {
      res.setHeader(header, HEADERS[header]);
    }

    next();
  });

  for (const service in routing) {
    for (const method in routing[service]) {
      app.post(`/api/${service}/${method}`, async (req, res) => {
        console
        const { args } = req.body;
        const handler = routing[service][method];
        const result = await handler(...args);
        return res.send(result.rows);
      })
    }
  }

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
  });
};
