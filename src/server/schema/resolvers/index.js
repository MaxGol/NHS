import _ from 'lodash'
import { mutations } from './mutations'
import { queries } from './queries'

export const resolvers = _.merge(
  mutations,
  queries
)
