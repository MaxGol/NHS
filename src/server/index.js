import { ApolloServer } from 'apollo-server-lambda'
import { schema } from './schema'

export { pbot } from './chat-bots/public-bot'
export { dbot } from './chat-bots/notes-from-public-bot'

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
