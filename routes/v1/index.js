let /* userRoutes = require('./user.routes'),
  customerRoutes = require('./customer.routes'),
  purchaseRoutes = require('./purchase.routes'),
  truckRoutes = require('./truck.routes'),
  saleRoutes = require('./sale.routes'),
  exchange_rateRoutes = require('./exchange_rate.routes'),
  attachedRoutes = require('./attached.routes'),
  dataRoutes = require('./data.routes'),
  financeRoutes = require('./finance.routes'), */
  invoiceRoutes = require('./invoice.routes'),
  root = [
    {
      method: 'GET',
      path: '/v1',
      config: { auth: false },
      handler: async (req, res) => {
        return 'V1!';
      }
    }
  ];

module.exports = [].concat(
  root,
  invoiceRoutes/*,
  userRoutes,
  customerRoutes,
  purchaseRoutes,
  truckRoutes,
  saleRoutes,
  dataRoutes,
  exchange_rateRoutes,
  attachedRoutes,
  financeRoutes*/
);
