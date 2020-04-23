import { UserInputError, ApolloError } from 'apollo-server-lambda'
import bcrypt from 'bcryptjs'
import { createAccessToken } from 'auth/auth'
import { docClient } from '../../../database'
import * as DB from '../../../database/tables'

export const login = async (parent, args, context, info) => {
  if (!args.email || !args.password) {
    throw new UserInputError('Email address or password not provided', { invalidArgs: Object.keys(args) })
  }
  try {
    const params = {
      TableName: DB.ADMIN,
      IndexName: DB.ADMIN_EMAIL_INDEX,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': args.email
      },
      Limit: 1
    }

    const { Items: [admin] } = await docClient.query(params).promise()

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
