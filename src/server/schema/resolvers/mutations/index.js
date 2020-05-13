import { login } from './login'
import { createAdmin } from './admin-mutation'
import { updateVoiceRecord } from './record-mutation'

export const mutations = {
  Mutation: {
    login,
    createAdmin,
    updateVoiceRecord
  }
}
