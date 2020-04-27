import { DynamoDB } from 'aws-sdk'
import _ from 'lodash'
import moment from 'moment'
import uuid4 from 'uuid/v4'
import * as DB from './tables'

const STAGE = process.env.STAGE
const endpoint = STAGE === 'development' ? 'http://localhost:8001' : undefined
export const logger = (...args) => {
  if (STAGE === 'development') console.log('Logger --->', ...args)
}

export const docClient = new DynamoDB.DocumentClient({ service: new DynamoDB({ endpoint }), convertEmptyValues: true }) // convertEmptyValues set to true

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
    logger('PUT', DB.USER_PUBLIC_TABLE)
  } catch (error) {
    console.log(error)
  }
}

export const getPublicUser = async (id) => {
  try {
    const response = await docClient.get({
      TableName: DB.USER_PUBLIC_TABLE,
      Key: {
        id: id
      }
    }).promise()
    logger('GET', DB.USER_PUBLIC_TABLE)
    if (_.isEmpty(response)) return {}
    else return response.Item
  } catch (error) {
    console.log(error)
  }
}

export const updatePublicUser = async (id, prop, value) => {
  try {
    await docClient.update({
      TableName: DB.USER_PUBLIC_TABLE,
      Key: { id },
      UpdateExpression: `SET #${prop} = :value`,
      ExpressionAttributeNames: { [`#${prop}`]: `${prop}` },
      ExpressionAttributeValues: { ':value': `${value}` },
      ReturnValues: 'UPDATED_NEW'
    }).promise()
    logger('UPDATE', DB.USER_PUBLIC_TABLE)
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
    logger('DELETE', DB.USER_PUBLIC_TABLE)
  } catch (error) {
    console.log(error)
  }
}

export const saveAudioContent = async (contact, payload) => {
  try {
    await docClient.put({
      TableName: DB.AUDIO_CONTENT_TABLE,
      Item: {
        id: uuid4(),
        user: contact.id,
        content: payload.url,
        approved: '0',
        created: moment(new Date()).format('YYYY-MM-DD').toString(),
        ttl: moment().add('2', 'weeks').unix()
      }
    }).promise()
    logger('PUT', DB.AUDIO_CONTENT_TABLE)
  } catch (error) {
    console.log(error)
  }
}

export const getAudioContents = async (user) => {
  try {
    const query = await docClient.query({
      TableName: DB.AUDIO_CONTENT_TABLE,
      IndexName: DB.SAVED_BY_USER_INDEX,
      KeyConditionExpression: '#user = :user and #created = :date',
      ExpressionAttributeNames: {
        '#user': 'user',
        '#created': 'created'
      },
      ExpressionAttributeValues: {
        ':user': user,
        ':date': moment(new Date()).format('YYYY-MM-DD').toString()
      }
    }).promise()
    logger('QUERY', DB.AUDIO_CONTENT_TABLE)
    return query
  } catch (error) {
    console.log(error)
  }
}

export const deleteAudioRecord = async (id) => {
  try {
    await docClient.delete({
      TableName: DB.AUDIO_CONTENT_TABLE,
      Key: { id }
    }).promise()
    logger('DELETE', DB.AUDIO_CONTENT_TABLE)
  } catch (error) {
    console.log(error)
  }
}

export const deleteAllUserRecords = async (id) => {
  const records = await getAudioContents(id)
  if (records) {
    _.forEach(records.Items, async (item) => {
      await deleteAudioRecord(item.id)
    })
  }
}

export const createSession = async (id, data) => {
  try {
    await docClient.put({
      TableName: DB.SESSION,
      Item: {
        id,
        created: Date.now(),
        ...data,
        ttl: moment().add('10', 'minutes').unix() // change to 1 hour
      }
    }).promise()
    logger('PUT', DB.SESSION)
  } catch (error) {
    console.log(error)
  }
}

export const getSession = async (id) => {
  try {
    const response = await docClient.get({
      TableName: DB.SESSION,
      Key: {
        id: id
      }
    }).promise()
    logger('GET', DB.SESSION)
    if (_.isEmpty(response)) return false
    if (moment().unix() - response.Item.ttl > 600) return false // change to less then 60 mins
    else return response.Item
  } catch (error) {
    console.log(error)
  }
}

export const deleteSession = async (id) => {
  try {
    await docClient.delete({
      TableName: DB.SESSION,
      Key: { id }
    }).promise()
    logger('DELETE', DB.SESSION)
  } catch (error) {
    console.log(error)
  }
}
