const FinanceController = require('../../controllers/finance.controller');

module.exports = [
  {
    method: 'POST',
    path: '/v1/finance',
    // config: { auth: 'jwt' },
    handler: FinanceController.getPlans
  }
];
