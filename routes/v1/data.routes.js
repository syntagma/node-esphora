const DataController = require('../../controllers/data.controller');

module.exports = [
  {
    method: 'GET',
    path: '/v1/data/sellers',
    config: { auth: 'jwt' },
    handler: DataController.getSellers
  },
  {
    method: 'GET',
    path: '/v1/data/purchaseTypes',
    config: { auth: 'jwt' },
    handler: DataController.getPurchaseTypes
  },
  {
    method: 'GET',
    path: '/v1/data/paymentMethods',
    config: { auth: 'jwt' },
    handler: DataController.getPaymentMethods
  },
  {
    method: 'GET',
    path: '/v1/data/otherTaxes',
    config: { auth: 'jwt' },
    handler: DataController.getOtherTaxes
  },
  {
    method: 'GET',
    path: '/v1/data/truckTypes',
    config: { auth: 'jwt' },
    handler: DataController.getTruckTypes
  }
];
