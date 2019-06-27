const { gql } = require('apollo-server-hapi');

const truck = gql`
  type Image {
    id: String
    position: Int
  }
  type Truck {
    id: String
    web_id: String
    is_new: Boolean
    status: String
    price: Float
    price_financing: Float
    name: String
    details: String
    domain: String
    model: String
    model_version: String
    chassis: String
    chassis_number: String
    brand: String
    year: Int
    body_type: String
    body_brand: String
    km: Int
    category: String
    warranty: String
    transmission: String
    power: Int
    type: String
    traction: String
    engine: String
    displacement: Float
    fuel_type: String
    lubricant: String
    pbv: Float
    torque: String
    emmissions_standard: String
    measure_length: Float
    measure_height: Float
    measure_width: Float
    bodywork: Boolean
    photos: [Image]
    wheelbase: Float
    wheelbase_third_axe: Float
    date_patenting: GraphQLDate
  }
  input TruckFilter {
    text: String
    brand: [String]
    status: [String]
  }
  input TruckWebFilter {
    text: String
    year: [Int]
    price: [Float]
    price_financing: [Float]
    km: [Int]
    brand: String
    engine: String
    transmission: String
    type: String
    category: String
    traction: String
  }
  type Trucks {
    items: [Truck]
    count: Int
  }
  type FilterItem {
    value: String
    count: Int
  }
  type Filter {
    _id: String
    items: [FilterItem]
  }
`;

module.exports = truck;
