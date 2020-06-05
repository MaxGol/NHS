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

export const createUser = async (user) => {
  try {
    await docClient.put({
      TableName: DB.USER_TABLE,
      Item: {
        ...user,
        created: Date.now()
      }
    }).promise()
    logger('PUT', DB.USER_TABLE)
  } catch (error) {
    throw new Error(`Create user error: ${error.message}`)
  }
}

export const getUser = async (id) => {
  try {
    const response = await docClient.get({
      TableName: DB.USER_TABLE,
      Key: {
        id: id
      }
    }).promise()
    logger('GET', DB.USER_TABLE)
    if (_.isEmpty(response)) return {}
    else return response.Item
  } catch (error) {
    console.log(error)
    throw new Error(`Get user error: ${error.message}`)
  }
}

export const updateUser = async (action, id, props) => {
  if (action === 'REMOVE') {
    try {
      const updatedUser = await docClient.update({
        TableName: DB.USER_TABLE,
        Key: { id },
        UpdateExpression: `${action} ${props.map((prop) => `#${prop}`).join(', ')}`,
        ExpressionAttributeNames: props.reduce((result, prop) => ({
          ...result,
          [`#${prop}`]: prop
        }), {}),
        ReturnValues: 'ALL_NEW'
      }).promise()
      logger('UPDATE', DB.USER_TABLE)
      return { ...updatedUser.Attributes }
    } catch (error) {
      console.log(error)
      throw new Error(`Update user error: ${error.message}`)
    }
  } else {
    try {
      const keys = _.keys(props)
      const updatedUser = await docClient.update({
        TableName: DB.USER_TABLE,
        Key: { id },
        UpdateExpression: `${action} ${keys.map((key) => `#${key} = :${key}`).join(', ')}`,
        ExpressionAttributeNames: keys.reduce((result, key) => ({
          ...result,
          [`#${key}`]: key
        }), {}),
        ExpressionAttributeValues: keys.reduce((result, key) => ({
          ...result,
          [`:${key}`]: props[key]
        }), {}),
        ReturnValues: 'ALL_NEW'
      }).promise()
      logger('UPDATE', DB.USER_TABLE)
      return { ...updatedUser.Attributes }
    } catch (error) {
      console.log(error)
      throw new Error(`Update user error: ${error.message}`)
    }
  }
}

export const deleteUser = async (id) => {
  try {
    await docClient.delete({
      TableName: DB.USER_TABLE,
      Key: { id }
    }).promise()
    logger('DELETE', DB.USER_TABLE)
  } catch (error) {
    console.log(error)
    throw new Error(`Delete user error: ${error.message}`)
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
        ttl: moment().add('1', 'years').unix()
      }
    }).promise()
    logger('PUT', DB.AUDIO_CONTENT_TABLE)
  } catch (error) {
    console.log(error)
    throw new Error(`Save voice record: ${error.message}`)
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
    throw new Error(`Get voice record: ${error.message}`)
  }
}

export const getApprovedAudioContent = async (records) => {
  try {
    const query = await docClient.query({
      TableName: DB.AUDIO_CONTENT_TABLE,
      IndexName: DB.APPROVED_CONTENT_INDEX,
      KeyConditionExpression: '#approved = :approved',
      ExpressionAttributeNames: {
        '#approved': 'approved'
      },
      ExpressionAttributeValues: {
        ':approved': '1'
      }
    }).promise()
    logger('QUERY', DB.AUDIO_CONTENT_TABLE)
    if (records) {
      const filteredRecords = _.filter(query.Items, (record) => !_.includes(records, record.id))
      if (filteredRecords.length) {
        const random = Math.floor(Math.random() * filteredRecords.length)
        return filteredRecords[random]
      } else {
        return query.Items[0]
      }
    } else {
      return query.Items[0]
    }
  } catch (error) {
    console.log(error)
    throw new Error(`Get approved voice records: ${error.message}`)
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
    throw new Error(`Delete voice record: ${error.message}`)
  }
}

export const deleteAllUserRecords = async (id) => {
  try {
    const records = await getAudioContents(id)
    if (records) {
      _.forEach(records.Items, async (item) => {
        await deleteAudioRecord(item.id)
      })
    }
  } catch (error) {
    throw new Error(`Delete all user voice records: ${error.message}`)
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
        ttl: moment().add('1', 'hour').unix()
      }
    }).promise()
    logger('PUT', DB.SESSION)
  } catch (error) {
    console.log(error)
    throw new Error(`Create session: ${error.message}`)
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
    if (response.Item.ttl - moment().unix() <= 0) return false
    else return response.Item
  } catch (error) {
    console.log(error)
    throw new Error(`Get session: ${error.message}`)
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
    throw new Error(`Delete session: ${error.message}`)
  }
}

export const updateSession = async (action, id, props) => {
  if (action === 'REMOVE') {
    try {
      const updatedUser = await docClient.update({
        TableName: DB.SESSION,
        Key: { id },
        UpdateExpression: `${action} ${props.map((prop) => `#${prop}`).join(', ')}`,
        ExpressionAttributeNames: props.reduce((result, prop) => ({
          ...result,
          [`#${prop}`]: prop
        }), {}),
        ReturnValues: 'ALL_NEW'
      }).promise()
      logger('UPDATE', DB.SESSION)
      return { ...updatedUser.Attributes }
    } catch (error) {
      console.log(error)
      throw new Error(`Update session: ${error.message}`)
    }
  } else {
    try {
      const propsWithTTL = {
        ...props,
        ttl: moment().add('1', 'hour').unix()
      }
      const keys = _.keys(propsWithTTL)
      const updatedUser = await docClient.update({
        TableName: DB.SESSION,
        Key: { id },
        UpdateExpression: `${action} ${keys.map((key) => `#${key} = :${key}`).join(', ')}`,
        ExpressionAttributeNames: keys.reduce((result, key) => ({
          ...result,
          [`#${key}`]: key
        }), {}),
        ExpressionAttributeValues: keys.reduce((result, key) => ({
          ...result,
          [`:${key}`]: propsWithTTL[key]
        }), {}),
        ReturnValues: 'ALL_NEW'
      }).promise()
      logger('UPDATE', DB.SESSION)
      return { ...updatedUser.Attributes }
    } catch (error) {
      console.log(error)
      throw new Error(`Update session: ${error.message}`)
    }
  }
}
