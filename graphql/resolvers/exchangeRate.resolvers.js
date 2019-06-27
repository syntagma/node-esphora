const {
  User,
  Customer,
  Truck,
  Purchase,
  Sale,
  ExchangeRate
} = require('../../models');

const resolvers = {
  exchangeRates(_, { offset, first, filter }) {
    logger.info(filter);
    let filter_json = { $and: [] };
    if (filter) {
      if (filter.text) {
        filter_json.$and.push({
          $text: { $search: filter.text }
        });
      }
      if (filter_json.$and.length == 0) filter_json = {};
    } else {
      filter_json = filter;
    }
    return ExchangeRate.find(filter_json)
      .skip(offset)
      .limit(first)
      .then(response => {
        return Sale.countDocuments(filter_json).then(count => {
          return {
            items: response,
            count: count
          };
        });
      });
  }
};

module.exports = resolvers;
