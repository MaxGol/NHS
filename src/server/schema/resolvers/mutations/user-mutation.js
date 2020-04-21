import { ApolloError, UserInputError } from 'apollo-server-lambda'
import { mysql } from 'database'
import moment from 'moment'

export const createUser = async (parent, args, context, info) => {
  const { user } = args
  if (!user.id || !user.platform) {
    throw new UserInputError('Invalid arguments', { invalidArgs: Object.keys(args) })
  }
  const newUser = {
    ...user,
    created: moment(new Date()).format('YYYY-MM-DD')
  }
  try {
    const query = 'INSERT INTO user SET ?'
    await mysql.query({ sql: query, values: newUser })
    return newUser
  } catch (error) {
    console.log(error)
    throw new ApolloError('Error saving user', 'SERVER_ERROR')
  }
}
