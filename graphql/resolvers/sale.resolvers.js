const {
  User,
  Customer,
  Truck,
  Purchase,
  Sale,
  ExchangeRate
} = require('../../models');

const resolvers = {
  sale(_, { filter }) {
    if (filter.truck_id) {
      filter['truck.truck_id'] = filter.truck_id;
      delete filter.truck_id;
    }
    return Sale.findOne(filter).then(response => response);
  },
  sales(_, { offset, first, filter }, context) {
    if (!context.credentials || !context.credentials.scope.includes('web')) return null;
    let filter_json = { $and: [] };
    if (filter) {
      if (filter.text) {
        filter_json.$and.push({
          $or: [
            { $text: { $search: filter.text } },
            { 'customer.cuit': !isNaN(filter.text) ? filter.text : '' }
          ]
        });
      }
      if (filter.assigned_seller)
        filter_json.$and.push({ assigned_seller: filter.assigned_seller });
      if (filter_json.$and.length == 0) filter_json = {};
    } else {
      filter_json = filter;
    }
    return Sale.find(filter_json)
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
  },
  salesByCustomer(_, { id }) {
    return Sale.find({ 'customer.customer_id': id }).then(response => response);
  }
};

module.exports = resolvers;
