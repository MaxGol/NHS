import { ApolloServer } from 'apollo-server-lambda'
import { schema } from './schema'
export { bot } from './chat-bots/nhs-bot'

const server = new ApolloServer({
  cors: true,
  schema,
  context: ({ event, context }) => {
    return {
      headers: event.headers,
      event,
      context
    }
  }
})

export const handler = (event, context, callback) => {
  const handler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true
    }
  })
  return handler(event, context, callback)
}
