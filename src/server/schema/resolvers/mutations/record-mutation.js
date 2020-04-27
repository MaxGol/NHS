import { UserInputError, ApolloError } from 'apollo-server-lambda'
import { docClient, logger } from '../../../database'
import * as DB from '../../../database/tables'

export const updateVoiceRecord = async (parent, args, context, info) => {
  if (!args.record) {
    throw new UserInputError('Record to update not provided', { invalidArgs: Object.keys(args) })
  }

  const { id, approved, content } = args.record

  try {
    await docClient.update({
      TableName: DB.AUDIO_CONTENT_TABLE,
      Key: { id },
      UpdateExpression: 'SET #approved = :value',
      ExpressionAttributeNames: { '#approved': 'approved' },
      ExpressionAttributeValues: { ':value': approved }
    }).promise()
    logger('UPDATE', DB.AUDIO_CONTENT_TABLE, { id, approved, content })
    return {
      id,
      content,
      approved
    }
  } catch (error) {
    console.log(error)
    throw new ApolloError(error.message, 'SERVER ERROR')
  }
}
