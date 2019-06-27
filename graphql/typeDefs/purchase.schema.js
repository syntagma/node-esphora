const { gql } = require('apollo-server-hapi');

const schema = gql`
  type PurchaseTruck {
    truck_id: String
    name: String
    brand: String
    model: String
    year: Int
    price: Float
    domain: String
  }
  type PurchaseProvider {
    customer_id: String
    company: String
    sap_provider_code: String
    cuit: Float
    address: String
    city_town: String
    main_activity: String
  }
  type PurchaseItem {
    id: String
    type: String
    details: String
    quantity: Int
    unit_amount: Float
    amount: Float
    usage: Float
  }
  type Purchase {
    id: String
    type: String
    number: String
    formatted_number: String
    date: GraphQLDate
    usage: Float
    amount: Float
    iva: Float
    total_amount: Float
    exchange_rate: Float
    total_amount_usd: Float
    status: String
    items: [PurchaseItem]
    provider: PurchaseProvider
    truck: PurchaseTruck
  }
  input PurchaseFilter {
    _id: String
    truck_id: String
    text: String
    date_start: String
    date_end: String
    type: String
  }
  type Purchases {
    items: [Purchase]
    count: Int
  }
  type AssociatedExpenses {
    purchase_id: String
    formatted_number: String
    type: String
    details: String
    company: String
    date: String
    amount: Float
    amount_usd: Float
    exchange_rate: Float
  }
`;

module.exports = schema;
