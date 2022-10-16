'use strict';

const http = require('node:http');

const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=UTF-8',
};

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

module.exports = (routing, port) => {
  http.createServer(async (req, res) => {
    res.writeHead(200, HEADERS);
    const { url, socket, method } = req;
    if (method !== 'POST') return res.end('Not found');
    const [prefix, name, procedure] = url.substring(1).split('/');
    if (prefix !== 'api') return res.end('Not found');
    const entity = routing[name];
    if (!entity) return res.end('Not found');
    const handler = entity[procedure];
    if (!handler) return res.end('Not found');
    const { args } = await receiveArgs(req);
    console.log(`${socket.remoteAddress} ${procedure} ${url}`);
    const result = await handler(...args);
    res.end(JSON.stringify(result.rows));
  }).listen(port);

  console.log(`API on port ${port}`);
};
