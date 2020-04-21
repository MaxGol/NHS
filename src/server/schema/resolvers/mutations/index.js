import { login } from './login'
import { createAdmin } from './admin-mutation'
import { createUser } from './user-mutation'

export const mutations = {
  Mutation: {
    login,
    createAdmin,
    createUser
  }
}
