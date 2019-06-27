const {
  User,
  Customer,
  Truck,
  Purchase,
  Sale,
  ExchangeRate
} = require('../../models');

const resolvers = {
  customer(_, { filter }) {
    return Customer.findOne(filter).then(response => response);
  },
  customers(_, { offset, first, filter }) {
    let filter_json = { $and: [] };
    if (filter) {
      if (filter.text) {
        filter_json.$and.push({
          $or: [
            { $text: { $search: filter.text } },
            { cuit: !isNaN(filter.text) ? filter.text : '' }
          ]
        });
      }
      if (filter.brand)
        filter_json.$and.push({ 'truck_searches.brand': filter.brand });
      if (filter.model)
        filter_json.$and.push({ 'truck_searches.model': filter.model });
      if (filter.assigned_seller)
        filter_json.$and.push({ assigned_seller: filter.assigned_seller });
      if (filter_json.$and.length == 0) filter_json = {};
    }
    return Customer.find(filter_json)
      .skip(offset)
      .limit(first)
      .then(response => {
        return Customer.countDocuments(filter_json).then(count => {
          return {
            items: response,
            count: count
          };
        });
      });
  },
  customersAll() {
    return Customer.find({}).then(response => response);
  }
};

module.exports = resolvers;
