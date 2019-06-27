const { gql } = require('apollo-server-hapi');

const exchangeRate = gql`
  type ExchangeRate {
    id: String
    rate: Float
    effectiveDate: GraphQLDate
  }
  type ExchangeRates {
    items: [ExchangeRate]
    count: Int
  }
  input ExchangeRatesFilter {
    _id: String
    date: String
    text: String
  }
`;

module.exports = exchangeRate;
