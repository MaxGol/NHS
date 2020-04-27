import { login } from './login'
import { createAdmin } from './admin-mutation'
import { createUser } from './user-mutation'
import { updateVoiceRecord } from './record-mutation'

export const mutations = {
  Mutation: {
    login,
    createAdmin,
    createUser,
    updateVoiceRecord
  }
}
