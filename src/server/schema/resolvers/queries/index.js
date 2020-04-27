import { getAdminByEmail } from './admin-query'
import { getAllVoiceRecords } from './voice-content-query'

export const queries = {
  Query: {
    getAdminByEmail,
    getAllVoiceRecords
  }
}
