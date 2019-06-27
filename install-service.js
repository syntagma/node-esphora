// The recommended way to install node-windows is with npm, using the global flag:
// npm install -g node-windows
// Then, in your project root, run:
// npm link node-windows

let Service = require('node-windows').Service,
  path = require('path'),
  svc = new Service({
    name: 'Facturs Afip',
    description: 'API de Facturs para brindar servicios de conexión con Afip.',
    script: path.join(__dirname, 'server.js')
  });

// Listen for the 'install' event, which indicates the
// process is available as a service.
svc.on('install', () => {
  'use strict';

  svc.start();
});

// install the service
svc.install();
