const ExchangeRateController = require('../../controllers/exchange_rate.controller');

module.exports = [
  {
    method: 'POST',
    path: '/v1/exchangeRates',
    config: { auth: 'jwt' },
    handler: ExchangeRateController.create
  },
  {
    method: 'GET',
    path: '/v1/exchangeRates/{id}',
    config: { auth: 'jwt' },
    handler: ExchangeRateController.get
  },
  {
    method: 'GET',
    path: '/v1/exchangeRates/today',
    // config: { auth: 'jwt' },
    handler: ExchangeRateController.getTodaysRate
  },
  {
    method: 'PUT',
    path: '/v1/exchangeRates/{id}',
    config: { auth: 'jwt' },
    handler: ExchangeRateController.update
  },
  {
    method: 'DELETE',
    path: '/v1/exchangeRates/{id}',
    config: { auth: 'jwt' },
    handler: ExchangeRateController.remove
  }
];
