const InvoiceController = require('../../controllers/invoice.controller');

module.exports = [
  {
    method: 'POST',
    path: '/v1/invoices',
    config: { auth: 'jwt' },
    handler: InvoiceController.create
  },
  {
    method: 'GET',
    path: '/v1/invoices/{id}',
    config: { auth: 'jwt' },
    handler: InvoiceController.get
  },
  {
    method: 'GET',
    path: '/v1/invoices/test',
    // config: { auth: 'jwt' },
    handler: InvoiceController.test
  }
];
