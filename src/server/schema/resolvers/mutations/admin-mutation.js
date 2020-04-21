import { ApolloError, UserInputError } from 'apollo-server-lambda'
import { mysql } from 'database'
import uuid4 from 'uuid/v4'
import bcrypt from 'bcryptjs'

export const createAdmin = async (parent, args, context, info) => {
  const { admin } = args
  if (!admin.email || !admin.password) {
    throw new UserInputError('Invalid arguments', { invalidArgs: Object.keys(args) })
  }
  const newAdmin = {
    ...admin,
    id: uuid4(),
    password: bcrypt.hashSync(admin.password, 10)
  }
  try {
    const query = 'INSERT INTO admin SET ?'
    await mysql.query({ sql: query, values: newAdmin })
    return newAdmin
  } catch (error) {
    console.log(error)
    throw new ApolloError('Error saving admin', 'SERVER_ERROR')
  }
}
