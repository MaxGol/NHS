import createResponseObject from '../helpers/createResponseObject'
import sendMessage from '../services/sendMessage'
// import _ from 'lodash'
import {
  getUser,
  // createUser,
  // deleteUser,
  //   updateUser,
  //   saveAudioContent,
  // getAudioContents,
  // deleteAllUserRecords,
  createSession,
  getSession,
  updateSession
  // deleteSession
} from '../database'

import { getResponseStatus } from '../services/responseStatus'
import { messages } from '../constants/responses'

const responseHandler = (status) => {
  return {
    statusCode: status
  }
}

export const bot = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const request = JSON.parse(event.body)
  try {
    if (request.event === 'message_received') {
      const channelID = request.data.channel.id
      const messageType = request.data.content.type
      const messagePayload = request.data.content.payload
      const contact = {
        id: request.data.contact.id,
        phone: request.data.contact.platform_id,
        name: request.data.contact.name
      }

      const user = await getUser(contact.id)
      const session = await getSession(contact.id)

      console.log('---> USER', user)
      console.log('---> SESSION', session)

      if (!session) await createSession(contact.id, user)
      else await updateSession(contact.id, 'data', { user: { ...user } })

      const sendMessageWithDelay = async (fn, param, ms) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fn(param))
          }, ms)
        })
      }

      const status = await getResponseStatus(user, session, messageType, messagePayload, channelID, contact)
      console.log('STATUS --->', status)

      if (status.type === 'UNHANDLED') {
        console.log('Something went wrong', status.user, status.session)
        const message = createResponseObject('text', 'Sorry I did not catch that, please try again', channelID, contact.id)
        await sendMessage(message)
        return responseHandler('200')
      } else if (status.type === 'DELETE') {
        const message = createResponseObject('text', `${contact.name} has been deleted`, channelID, contact.id)
        await sendMessage(message)
        return responseHandler('200')
      } else if (status.type === 'USER_WANTS_TO_REGISTER_AS_PUBLIC') {
        const image = createResponseObject('image', messages.first_time_public_user_image, channelID, session.id)
        const message = createResponseObject('text', messages.first_time_public_user_greeting, channelID, session.id)
        await sendMessage(image)
        await sendMessageWithDelay(sendMessage, message, 1000)
        return responseHandler('200')
      } else if (status.type === 'USER_WANTS_TO_REGISTER_AS_NHS') {
        const image = createResponseObject('image', messages.first_time_nhs_user_image, channelID, session.id)
        const message = createResponseObject('text', messages.first_time_nhs_user_greeting, channelID, session.id)
        await sendMessage(image)
        await sendMessageWithDelay(sendMessage, message, 1000)
        return responseHandler('200')
      } else {
        const message = createResponseObject('text', messages[status.type], channelID, contact.id)
        await sendMessage(message)
        return responseHandler('200')
      }
    } else {
      console.log('--- UNHANDLED --->', request.event)
      return responseHandler('200')
    }
  } catch (error) {
    console.log(error)
    return responseHandler('400')
  }
}
