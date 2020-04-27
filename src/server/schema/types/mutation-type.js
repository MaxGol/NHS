import { gql } from 'apollo-server-lambda'

export const Mutations = gql`
  type Mutation {
    createAdmin(admin: AdminInput): Admin,
    createUser(user: UserInput): User,
    updateUser(user: UserInput): User,
    updateVoiceRecord(record: VoiceRecordInput): VoiceRecord,
    login(email: String, password: String): LoginResponse
  }
`
