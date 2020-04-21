import { gql } from 'apollo-server-lambda'

export const Mutations = gql`
  type Mutation {
    createAdmin(admin: AdminInput): Admin,
    createUser(user: UserInput): User,
    updateUser(user: UserInput): User,
    login(email: String, password: String): LoginResponse
  }
`
