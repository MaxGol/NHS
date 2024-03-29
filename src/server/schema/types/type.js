import { gql } from 'apollo-server-lambda'

export const Scalar = gql`
  scalar Date
`

export const User = gql`
  type User {
    id: ID!,
    consent: Int!,
    created: Int!,
    over18: Int!,
    phone: String!
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

export const VoiceRecordInput = gql`
  input VoiceRecordInput {
    id: ID!,
    content: String!,
    approved: String!
  }
`

export const VoiceRecord = gql`
  type VoiceRecord {
    id: ID!,
    content: String!,
    approved: String!,
    ttl: Int
  }
`
