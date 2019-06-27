const { gql } = require('apollo-server-hapi');

const sale = gql`
  type SaleTruck {
    id: String
    name: String
    brand: String
    model: String
    year: Int
    price: Float
    domain: String
  }
  type SaleCustomer {
    id: String
    company: String
    sap_customer_code: String
    cuit: Float
    address: String
    city_town: String
    main_activity: String
  }
  type SaleOtherTax {
    id: String
    name: String
    amount: Float
    amount_usd: Float
  }
  type Sale {
    id: String
    number: Int
    point_of_sale: Int
    letter: String
    formatted_number: String
    sap_number: Int
    date: GraphQLDate
    truck: SaleTruck
    customer: SaleCustomer
    files: String
    seller: String
    payment_method: String
    net_amount: Float
    net_amount_usd: Float
    vat: Float
    vat_usd: Float
    total_amount: Float
    total_amount_usd: Float
    exchange_rate: Float
    other_taxes: [SaleOtherTax]
  }
  type Sales {
    items: [Sale]
    count: Int
  }
  input SaleFilter {
    _id: String
    text: String
    date_start: String
    date_end: String
    assigned_seller: String
  }
  input SalessFilter {
    _id: String
    truck_id: String
  }
`;

module.exports = sale;
