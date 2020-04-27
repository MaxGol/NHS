import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`

export const UPDATE_RECORD = gql`
mutation ($record: VoiceRecordInput) {
  updateVoiceRecord(record: $record){
    id
    approved
    content
  }
}
`
