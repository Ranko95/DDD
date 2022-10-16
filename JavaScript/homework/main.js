'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');

const config = require('./config.js');

const load = require('./load.js')(config.sandbox);
const db = require('./db.js')(config.db.postgres);
const server = require('./framework')(config.server.api.framework, config.server.api.transport);
const staticServer = require('./static.js');
const hash = require('./hash.js');
const logger = require('./logger.js');

const sandbox = {
  console: Object.freeze(logger),
  db: Object.freeze(db),
  common: { hash },
};
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = await load(filePath, sandbox);
  }

  console.dir({ routing });

  staticServer('./static', config.server.static.port);
  server(routing, config.server.api.port);
})();
