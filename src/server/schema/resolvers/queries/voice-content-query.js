import { docClient } from '../../../database'
import * as DB from '../../../database/tables'
import _ from 'lodash'

export const getAllVoiceRecords = async (parent, args, context, info) => {
  try {
    const results = await docClient.scan({
      TableName: DB.AUDIO_CONTENT_TABLE,
      FilterExpression: '#created <> :this_year',
      ExpressionAttributeNames: { '#created': 'created' },
      ExpressionAttributeValues: { ':this_year': '' }
    }).promise()
    if (_.isEmpty(results)) return []
    else {
      const voiceRecords = _.map(results.Items, (item) => {
        return {
          id: item.id,
          content: item.content,
          approved: item.approved,
          ttl: item.ttl
        }
      })
      return _.reverse(_.sortby(voiceRecords, 'ttl'))
    }
  } catch (error) {
    console.log(error)
  }
}
