const { gql } = require('apollo-server-hapi');

const customer = gql`
  type Customer {
    id: String
    sap_client_code: String
    sap_provider_code: String
    company: String
    cuit: Float
    address: String
    holder: String
    email_holder: String
    telephone_holder: Int
    commercial: String
    email_commercial: String
    telephone_commercial: Int
    unit_sold_st: Int
    main_activity: String
    detail_visits: String
    truck_searches: String
    observations: String
  }
  type Customers {
    items: [Customer]
    count: Int
  }
  input CustomerFilter {
    text: String
    brand: String
    model: String
    assigned_seller: String
  }
  input CustomersFilter {
    _id: String
  }
`;

module.exports = customer;
