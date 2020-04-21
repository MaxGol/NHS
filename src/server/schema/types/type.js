import { gql } from 'apollo-server-lambda'

export const Scalar = gql`
  scalar Date
`

export const UserInput = gql`
  input UserInput {
    id: ID!,
    platform: String!,
    created: Date,
    last_used_at: Date
  }
`

export const User = gql`
  type User {
    id: ID,
    platform: String,
    created: Date,
    last_used_at: Date
  }
`

export const AdminInput = gql`
  input AdminInput {
    id: ID,
    email: String!,
    password: String!
  }
`

export const Admin = gql`
  type Admin {
    id: ID!,
    email: String!,
    password: String!
  }
`

export const LoginResponse = gql`
  type LoginResponse {
    accessToken: ID!
  }
`
