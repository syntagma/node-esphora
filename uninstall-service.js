let Service = require('node-windows').Service,
  path = require('path'),
  svc = new Service({
    name: 'Facturs Afip',
    description: 'API de Facturs para brindar servicios de conexión con Afip.',
    script: path.join(__dirname, 'server.js')
  });

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', () => {
  'use strict';
  console.log('The service exists: ', svc.exists);
  console.log('Uninstall complete.');
});

// Uninstall the service.
svc.uninstall();
