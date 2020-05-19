import { encrypt, decrypt } from '../../../helpers/crypto'
import { docClient } from '../../../database'
import * as DB from '../../../database/tables'

export const getUserByPhone = async (parent, args, context, info) => {
  const { phone } = args
  try {
    const response = await docClient.query({
      TableName: DB.USER_TABLE,
      IndexName: DB.USER_PHONE_INDEX,
      KeyConditionExpression: '#phone = :phone',
      ExpressionAttributeNames: { '#phone': 'phone' },
      ExpressionAttributeValues: { ':phone': encrypt(phone) }
    }).promise()
    return {
      ...response.Items[0],
      phone: decrypt(response.Items[0].phone)
    }
  } catch (error) {
    console.log(error)
  }
}
