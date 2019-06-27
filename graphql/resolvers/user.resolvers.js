const {
  User,
  Customer,
  Truck,
  Purchase,
  Sale,
  ExchangeRate
} = require('../../models');

const resolvers = {
  user(_, { id }) {
    return User.findById(id).then(response => response);
  },
  users() {
    return User.find({}).then(response => response);
  }
};

module.exports = resolvers;
