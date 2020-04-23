import { DynamoDB } from 'aws-sdk'
import _ from 'lodash'
import moment from 'moment'
import uuid4 from 'uuid/v4'
import * as DB from './tables'

const STAGE = process.env.STAGE
const endpoint = STAGE === 'development' ? 'http://localhost:8001' : undefined
const logger = (...args) => {
  if (STAGE === 'development') console.log('Logger --->', ...args)
}

export const docClient = new DynamoDB.DocumentClient({ service: new DynamoDB({ endpoint }) })

export const getPublicUser = async (id) => {
  try {
    const response = await docClient.get({
      TableName: DB.USER_PUBLIC_TABLE,
      Key: {
        id: id
      }
    }).promise()
    logger('GET', DB.USER_PUBLIC_TABLE, id)
    if (_.isEmpty(response)) return {}
    else return response.Item
  } catch (error) {
    console.log(error)
  }
}

export const createPublicUser = async (contact) => {
  try {
    await docClient.put({
      TableName: DB.USER_PUBLIC_TABLE,
      Item: {
        id: contact.id,
        user: {
          phone: contact.phone,
          name: contact.name,
          created: Date.now()
        }
      }
    }).promise()
    logger('PUT', DB.USER_PUBLIC_TABLE, contact)
  } catch (error) {
    console.log(error)
  }
}

export const updatePublicUser = async (id, prop, value, step) => {
  try {
    const user = await docClient.update({
      TableName: DB.USER_PUBLIC_TABLE,
      Key: { id },
      UpdateExpression: `SET #${prop} = :value`,
      ExpressionAttributeNames: { [`#${prop}`]: `${prop}` },
      ExpressionAttributeValues: { ':value': `${value}` },
      ReturnValues: 'UPDATED_NEW'
    }).promise()
    logger('UPDATE', DB.USER_PUBLIC_TABLE, id, prop, value, user)
  } catch (error) {
    console.log(error)
  }
}

export const deletePublicUser = async (id) => {
  try {
    await docClient.delete({
      TableName: DB.USER_PUBLIC_TABLE,
      Key: { id }
    }).promise()
    logger('DELETE', DB.USER_PUBLIC_TABLE, id)
  } catch (error) {
    console.log(error)
  }
}

export const getAudioContent = async () => {
  // get audio content for given date
}

export const saveAudioContent = async (contact, payload) => {
  const Item = {
    id: uuid4(),
    user: contact.id,
    content: payload.url,
    approved: false,
    created: Date.now(),
    ttl: moment().add('2', 'weeks').unix()
  }
  try {
    await docClient.put({
      TableName: DB.AUDIO_CONTENT_TABLE,
      Item
    }).promise()
    logger('PUT', DB.AUDIO_CONTENT_TABLE, Item)
  } catch (error) {
    console.log(error)
  }
}
