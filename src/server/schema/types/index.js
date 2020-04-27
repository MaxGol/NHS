import { Mutations } from './mutation-type'
import { Queries } from './query-type'
import {
  UserInput,
  User,
  AdminInput,
  Admin,
  VoiceRecordInput,
  VoiceRecord,
  Scalar,
  LoginResponse
} from './type'

export const typeDefs = [
  UserInput,
  User,
  AdminInput,
  Admin,
  VoiceRecordInput,
  VoiceRecord,
  Scalar,
  LoginResponse,
  Queries,
  Mutations
]
