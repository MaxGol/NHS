import { UserInputError, ApolloError } from 'apollo-server-lambda'
import { mysql } from 'database'
import bcrypt from 'bcryptjs'
import _ from 'lodash'
import { createAccessToken } from 'auth/auth'

export const login = async (parent, args, context, info) => {
  if (!args.email || !args.password) {
    throw new UserInputError('Email address or password not provided', { invalidArgs: Object.keys(args) })
  }
  try {
    const query = 'SELECT * FROM admin WHERE email = ?'
    const admin = _.head(await mysql.query({ sql: query, values: args.email }))

    if (!admin) {
      throw new Error('Admin does not exists')
    }

    const validPassword = bcrypt.compareSync(args.password, admin.password)

    if (!validPassword) {
      throw new Error('Wrong password')
    }

    return {
      accessToken: createAccessToken(admin.id)
    }
  } catch (error) {
    console.log(error)
    throw new ApolloError(error.message, 'SERVER ERROR')
  }
}
