import createResponseObject from '../helpers/createResponseObject'
import sendMessage from '../services/sendMessage'
import {
  getUser,
  createSession,
  getSession
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
  console.log('---> REQUEST', request)
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

      if (!session) await createSession(contact.id)

      const sendMessageWithDelay = async (fn, param, ms) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fn(param))
          }, ms)
        })
      }

      const status = await getResponseStatus(user, session, messageType, messagePayload, contact)
      console.log('STATUS --->', status)

      if (status.type === 'UNHANDLED') {
        console.log('Something went wrong', status.user, status.session)
        const message = createResponseObject('text', 'Sorry I did not catch that, please try again', channelID, contact.id)
        await sendMessage(message)
        return responseHandler('200')
      } else if (status.type === 'DELETE') {
        const message = createResponseObject('text', 'No problem, we\'ve deleted your details and voice notes from our system.', channelID, contact.id)
        await sendMessage(message)
        return responseHandler('200')
      } else if (status.type === 'KILL_SESSION') {
        const message = createResponseObject('text', 'Session deleted', channelID, contact.id)
        await sendMessage(message)
        return responseHandler('200')
      } else if (status.type === 'USER_WANTS_TO_REGISTER_AS_PUBLIC') {
        const image = createResponseObject('image', messages.FIRST_TIME_PUBLIC_USER_IMAGE, channelID, session.id)
        const message = createResponseObject('text', messages.FIRST_TIME_PUBLIC_USER_GREETING, channelID, session.id)
        await Promise.all([sendMessage(image), sendMessageWithDelay(sendMessage, message, 1000)])
        return responseHandler('200')
      } else if (status.type === 'USER_WANTS_TO_REGISTER_AS_NHS') {
        const image = createResponseObject('image', messages.FIRST_TIME_NHS_USER_IMAGE, channelID, session.id)
        const message = createResponseObject('text', messages.FIRST_TIME_NHS_USER_GREETING, channelID, session.id)
        await Promise.all([sendMessage(image), sendMessageWithDelay(sendMessage, message, 1000)])
        return responseHandler('200')
      } else if (status.type === 'USER_PASSED_REGISTRATION_CAN_RECEIVE_FIRST_AUDIO') {
        const congratsMessage = createResponseObject('text', messages.VERIFICATION_CODE_VALID, channelID, user.id)
        const audio = createResponseObject('audio', status.record, channelID, user.id)
        const finalMessageAfterFirstRecord = createResponseObject('text', messages.FINAL_MESSAGE_AFTER_FIRST_RECORD, channelID, contact.id)
        await Promise.all([sendMessage(congratsMessage), sendMessageWithDelay(sendMessage, audio, 1000), sendMessageWithDelay(sendMessage, finalMessageAfterFirstRecord, 2000)])
        return responseHandler('200')
      } else if (status.type === 'DIFFERENT_FILE_TYPE') {
        const random = Math.floor(Math.random() * messages.DIFFERENT_FILE_TYPE.length)
        const message = createResponseObject('text', messages.DIFFERENT_FILE_TYPE[random], channelID, session.id)
        await sendMessage(message)
        return responseHandler('200')
      } else if (status.type === 'NHS_USER_REQUESTS_VOICE_MESSAGE') {
        const random = Math.floor(Math.random() * messages.NHS_USER_REQUESTS_VOICE_MESSAGE.length)
        const message = createResponseObject('text', messages.NHS_USER_REQUESTS_VOICE_MESSAGE[random], channelID, session.id)
        const audio = createResponseObject('audio', status.record, channelID, user.id)
        await Promise.all([sendMessage(message), sendMessageWithDelay(sendMessage, audio, 1000)])
      } else {
        if (status.record) {
          const audio = createResponseObject('audio', status.record, channelID, user.id)
          await sendMessage(audio)
          return responseHandler('200')
        } else {
          const message = createResponseObject('text', messages[status.type], channelID, contact.id)
          await sendMessage(message)
          return responseHandler('200')
        }
      }
    } else {
      console.log('UNHANDLED --->', request.event)
      return responseHandler('200')
    }
  } catch (error) {
    console.log(error)
    return responseHandler('400')
  }
}
