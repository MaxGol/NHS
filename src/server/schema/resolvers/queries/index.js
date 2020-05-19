import { getAdminByEmail } from './admin-query'
import { getAllVoiceRecords } from './voice-content-query'
import { getUserByPhone } from './user-query'

export const queries = {
  Query: {
    getAdminByEmail,
    getAllVoiceRecords,
    getUserByPhone
  }
}
