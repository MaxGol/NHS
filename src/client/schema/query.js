import gql from 'graphql-tag'

export const IS_LOGGED_IN = gql`
query IsUserLoggedIn {
  isLoggedIn @client
}
`

export const GET_ALL_RECORDS = gql`
query getAllVoiceRecords {
  getAllVoiceRecords {
    id
    approved
    content
    ttl
  }
}
`
