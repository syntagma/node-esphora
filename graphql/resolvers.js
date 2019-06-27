const { merge } = require('lodash');
const { User, Truck, Purchase, Sale, ExchangeRate } = require('../models');

const customerResolvers = require('./resolvers/customer.resolvers');
const userResolvers = require('./resolvers/user.resolvers');
const truckResolvers = require('./resolvers/truck.resolvers');
const saleResolvers = require('./resolvers/sale.resolvers');
const exchangeRateResolvers = require('./resolvers/exchangeRate.resolvers');

module.exports = {
  Query: merge(
    customerResolvers,
    userResolvers,
    truckResolvers,
    saleResolvers,
    exchangeRateResolvers
  )
};
