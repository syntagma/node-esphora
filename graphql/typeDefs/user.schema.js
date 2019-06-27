const { gql } = require('apollo-server-hapi');

const user = gql`
  type User {
    id: String
    name: String
    email: String
    password: String
  }
`;

module.exports = user;
