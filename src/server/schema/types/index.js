import { Mutations } from './mutation-type'
import { Queries } from './query-type'
import {
  User,
  AdminInput,
  Admin,
  VoiceRecordInput,
  VoiceRecord,
  Scalar,
  LoginResponse
} from './type'

export const typeDefs = [
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
