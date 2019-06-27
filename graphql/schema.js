const { gql } = require('apollo-server-hapi');
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require('graphql-iso-date');

const user = require('./typeDefs/user.schema');
const customer = require('./typeDefs/customer.schema');
const truck = require('./typeDefs/truck.schema');
const purchase = require('./typeDefs/purchase.schema');
const sale = require('./typeDefs/sale.schema');
const exchangeRate = require('./typeDefs/exchangeRate.schema');

const schema = gql`
  scalar GraphQLDate
  input Sort {
    column: String
    criteria: Int
  }
  type Query {
    user(id: String!): User
    users: [User]
    customer(filter: CustomerFilter!): Customer
    customers(offset: Int = 0, first: Int, filter: CustomerFilter!): Customers
    customersAll: [Customer]
    truck(id: String!): Truck
    trucks(
      offset: Int = 0
      first: Int
      filter: TruckFilter!
      sort: Sort!
    ): Trucks
    trucksWeb(
      offset: Int = 0
      first: Int
      filter: TruckWebFilter!
      sort: Sort!
    ): Trucks
    trucksAll: [Truck]
    trucksWithoutInvoicePurchase: [Truck]
    trucksWithoutInvoiceSale: [Truck]
    trucksCount: Int
    trucksFilters: [Filter]
    trucksWebFilters(filter: TruckWebFilter!): [Filter]
    trucksHighlighters: [Truck]
    purchase(filter: PurchaseFilter!): Purchase
    purchases(
      offset: Int = 0
      first: Int
      filter: PurchaseFilter!
      sort: Sort!
    ): Purchases
    associatedExpenses(truck_id: String!): [AssociatedExpenses]
    sale(filter: SalessFilter!): Sale
    sales(offset: Int = 0, first: Int, filter: SaleFilter!, sort: Sort!): Sales
    exchangeRates(
      offset: Int = 0
      first: Int
      filter: ExchangeRatesFilter!
    ): ExchangeRates
    salesByCustomer(id: String!): [Sale]
  }
`;

module.exports = [schema, user, customer, truck, purchase, sale, exchangeRate];
