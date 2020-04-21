import { makeExecutableSchema } from 'apollo-server-lambda'
import { resolvers } from './resolvers'
import { typeDefs } from './types'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
