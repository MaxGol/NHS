import { Mutations } from './mutation-type'
import { Queries } from './query-type'
import {
  UserInput,
  User,
  AdminInput,
  Admin,
  Scalar,
  LoginResponse
} from './type'

export const typeDefs = [
  UserInput,
  User,
  AdminInput,
  Admin,
  Scalar,
  LoginResponse,
  Queries,
  Mutations
]
