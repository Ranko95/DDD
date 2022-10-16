'use strict';

const transport = {};
let api;

transport.ws = (url) => (structure) => {
  const socket = new WebSocket(url);

  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) => new Promise((resolve) => {
        const packet = { name: serviceName, method: methodName, args };
        socket.send(JSON.stringify(packet));
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          resolve(data);
        };
      });
    }
  }
  return new Promise((resolve) => socket.addEventListener('open', () => resolve(api)));
};

transport.http = (url) => (structure) => {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) => new Promise((resolve, reject) => {
        fetch(`${url}/api/${serviceName}/${methodName}`, { 
          method: 'POST',
          body: JSON.stringify({ args }),
          headers: { 
            'Content-Type': 'application/json' 
          }
        })
          .then((response) => {
            if (response.status === 200) resolve(response.json()) 
            else reject(new Error(`Status Code: ${response.status}`))
          })
      });
    }
  }
  return Promise.resolve(api);
};

const scaffold = (url) => {
  const protocol = url.startsWith('ws:') ? 'ws' : 'http';
  return transport[protocol](url);
};

(async () => {
  api = await scaffold('http://localhost:8001')({
    user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
    },
    country: {
      read: ['id'],
      delete: ['id'],
      find: ['mask'],
    },
  });

  const data = await api.user.read(1);
  console.dir({ data });
})();
