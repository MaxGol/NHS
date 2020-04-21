import { gql } from 'apollo-server-lambda'

export const Queries = gql`
  type Query {
    getAdminByEmail(email: String!): Admin
  }
`
