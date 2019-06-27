const SaleController = require('../../controllers/sale.controller');

module.exports = [
  {
    method: 'POST',
    path: '/v1/sales',
    config: { auth: 'jwt' },
    handler: SaleController.create
  },
  {
    method: 'POST',
    path: '/v1/sales/{id}/files',
    config: {
      auth: 'jwt',
      payload: {
        output: 'stream',
        allow: 'multipart/form-data'
      }
    },
    handler: SaleController.uploadFiles
  },
  {
    method: 'GET',
    path: '/v1/sales/{id}',
    config: { auth: 'jwt' },
    handler: SaleController.get
  },
  {
    method: 'PUT',
    path: '/v1/sales/{id}',
    config: { auth: 'jwt' },
    handler: SaleController.update
  },
  {
    method: 'DELETE',
    path: '/v1/sales/{id}',
    config: { auth: 'jwt' },
    handler: SaleController.remove
  }
];
