import createResponseObject from '../services/createResponseObject'
import sendMessage from '../services/sendMessage'
import isAnswerYes from '../services/isAnswerYes'
import _ from 'lodash'
import {
  getUser,
  createUser,
  deleteUser,
  updateUser,
  getApprovedAudioContent,
  createSession,
  getSession,
  updateSession,
  deleteSession
} from '../database'
import * as DB from '../database/tables'
import randomize from 'randomatic'
import { validate } from 'email-validator'
import { sendVerificationEmail } from '../services/email/sendVerificationEmail'

const validEmailDomains = ['nhs.net', 'nhs.uk', 'hscni.net', 'hscni.net', 'scot.nhs.net', 'wales.nhs.et', 'voxlydigital.com']

const messages = {
  first_time_user_image: 'https://s3-eu-west-1.amazonaws.com/voxly.client.skills/assets/NHS-BOTS/img/welcome_doc_img.png',
  first_time_user_greeting: 'Hello you absolute hero! \n\nYou are not alone! 70 million people are standing right behind you.💙 \n\nWe’re so grateful for what you are doing. The sacrifice that you and your families are making has not gone unnoticed. 🌈 \n\nIn this channel you can hear voice Notes from the Nation: short messages of support from the members of the public to keep you going. \n\n🔗Check this link for details on how it works: thenationalhopeservice.com \n\nAre you happy with this, and ready to get going?',
  consent_yes: 'Great! To make sure the messages get to the right place, I need to confirm that you’re working for the NHS. \n\n💌What is your work email? We will send you a 5-digit code to verify your email account (don’t worry, we won’t store it or use it for any other purposes)',
  consent_no: 'No worries, ping us here, if you change your mind. Stay safe 🏠',
  invalid_answer_consent: '🤔 Sorry, I’m not sure I understood you. I need to confirm that you’re keen to use this service. Just type ‘Yes’ or ‘No’ to proceed.',
  email_sent_confirmation: 'Thanks! We’ve sent you an email. \n\nWhat is your 5-digit code?',
  email_error_1: 'Hmm, that doesn\'t look like a valid NHS email address. Try typing that again...',
  email_error_2: 'Look like that one\'s still not working. You need to have a valid @nhs email. Type it again',
  email_error_3: 'Sorry, unless you have a valid @nhs email you can\'t access this service',
  verification_code_valid: '✅ Perfect! We’ve already got a note ready for you...',
  verification_code_invalid: '❌ This validation code do not much. Please try again.',
  end_of_registration: 'Hopefully that brightened your day a bit. Whenever you want to hear another one, just send an emoji. Keep going, you are incredible! 🌈',
  incorrect_message_type: 'At the moment we only accept text messages. Thank you.',
  no_records: 'Unfortunatelly there are no records at the moment. Try another time.'
}

const domainCheck = (email) => {
  const splitEmail = email.split('@')
  const domain = splitEmail[splitEmail.length - 1]
  return validEmailDomains.includes(domain)
}

const emailValidationCheck = (email) => {
  if (validate(email) && domainCheck(email)) return { check: true, message: messages.email_sent_confirmation }
  else if (!validate(email)) return { check: false, message: messages.email_error_1 }
  else if (!domainCheck(email)) return { check: false, message: messages.email_error_2 }
  else return { check: false, message: messages.email_error_3 }
}

const responseHandler = (status) => {
  return {
    statusCode: status,
    body: JSON.stringify({ message: 'success' })
  }
}

const sendMessageWithDelay = async (fn, param, ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn(param))
    }, ms)
  })
}

export const dbot = async (event, context) => {
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

      const user = await getUser(DB.USER_DOCTORS_TABLE, contact.id)
      const session = await getSession(contact.id)

      console.log('--------------> USER', user)
      console.log('--------------> SESSION', session)

      if (!session) await createSession(contact.id, { user })
      else await updateSession(contact.id, 'user', user)

      if (messageType === 'text') {
        if (_.toUpper(messagePayload) === 'DELETE') {
          await deleteUser(DB.USER_DOCTORS_TABLE, contact.id)
          await deleteSession(contact.id)
          const message = createResponseObject('text', `${contact.name} has been deleted`, channelID, contact.id)
          await sendMessage(message)
          return responseHandler('200')
        }

        if (!_.isEmpty(user)) {
          if (!user.consent && isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.consent_yes, channelID, contact.id)
            await sendMessage(message)
            await updateUser(DB.USER_DOCTORS_TABLE, contact.id, 'consent', true)
            await updateSession(contact.id, 'consent', true)
            return responseHandler('200')
          } else if (!user.consent && _.toUpper(messagePayload) === 'NO') {
            const message = await createResponseObject('text', messages.consent_no, channelID, contact.id)
            await sendMessage(message)
            await deleteUser(DB.USER_DOCTORS_TABLE, contact.id)
            return responseHandler('200')
          } else if (!user.consent && _.toUpper(messagePayload) !== 'NO' && !user.consent && !isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.invalid_answer_consent, channelID, contact.id)
            await sendMessage(message)
            return responseHandler('200')
          }

          if (user.consent && user.verificationCode && user.validation) {
            const record = await getApprovedAudioContent(user.records)
            if (_.isEmpty(record)) {
              const message = createResponseObject('text', messages.no_records, channelID, contact.id)
              await sendMessage(message)
              const finalMessage = createResponseObject('text', messages.end_of_registration, channelID, contact.id)
              await sendMessageWithDelay(sendMessage, finalMessage, 1000)
              return responseHandler('200')
            } else {
              const audio = createResponseObject('audio', record.content, channelID, contact.id)
              await sendMessage(audio)
              await updateUser(DB.USER_DOCTORS_TABLE, contact.id, 'records', [...user.records, record.id])
              return responseHandler('200')
            }
          } else if (user.consent && user.verificationCode) {
            if (user.verificationCode === messagePayload) {
              await updateUser(DB.USER_DOCTORS_TABLE, contact.id, 'validation', true)
              await updateSession(contact.id, 'validation', true)
              const message = createResponseObject('text', messages.verification_code_valid, channelID, contact.id)
              await sendMessage(message)
              const record = await getApprovedAudioContent(user.records)
              if (_.isEmpty(record)) {
                const message = createResponseObject('text', messages.no_records, channelID, contact.id)
                await sendMessage(message)
                const finalMessage = createResponseObject('text', messages.end_of_registration, channelID, contact.id)
                await sendMessageWithDelay(sendMessage, finalMessage, 1000)
                return responseHandler('200')
              } else {
                const audio = createResponseObject('audio', record.content, channelID, contact.id)
                await sendMessage(audio)
                const finalMessage = createResponseObject('text', messages.end_of_registration, channelID, contact.id)
                await sendMessageWithDelay(sendMessage, finalMessage, 1000)
                await updateUser(DB.USER_DOCTORS_TABLE, contact.id, 'records', [record.id])
                return responseHandler('200')
              }
            } else {
              const message = createResponseObject('text', messages.verification_code_invalid, channelID, contact.id)
              await sendMessage(message)
              return responseHandler('200')
            }
          } else if (user.consent && !user.verificationCode) {
            const messageCheck = emailValidationCheck(messagePayload)
            if (messageCheck.check) {
              const verificationCode = randomize('0', 5)
              await updateUser(DB.USER_DOCTORS_TABLE, contact.id, 'verificationCode', verificationCode)
              await updateSession(contact.id, 'verificationCode', verificationCode)
              await sendVerificationEmail(messagePayload, verificationCode)
              const message = await createResponseObject('text', messageCheck.message, channelID, contact.id)
              await sendMessage(message)
              return responseHandler('200')
            } else {
              const message = await createResponseObject('text', messageCheck.message, channelID, contact.id)
              await sendMessage(message)
              return responseHandler('200')
            }
          }
        } else {
          const image = createResponseObject('image', messages.first_time_user_image, channelID, contact.id)
          const message = createResponseObject('text', messages.first_time_user_greeting, channelID, contact.id)
          await sendMessage(image)
          await sendMessageWithDelay(sendMessage, message, 1000)
          await createUser(DB.USER_DOCTORS_TABLE, contact)
          return responseHandler('200')
        }
      } else if (messageType !== 'text') {
        if (_.isEmpty(user)) {
          const image = createResponseObject('image', messages.first_time_user_image, channelID, contact.id)
          const message = createResponseObject('text', messages.first_time_user_greeting, channelID, contact.id)
          await sendMessage(image)
          await sendMessageWithDelay(sendMessage, message, 1000)
          await createUser(DB.USER_DOCTORS_TABLE, contact)
          return responseHandler('200')
        } else {
          const message = createResponseObject('text', messages.incorrect_message_type, channelID, contact.id)
          await sendMessage(message)
          return responseHandler('200')
        }
      }
    }
  } catch (error) {
    console.log(error)
    return responseHandler('400')
  }
  return responseHandler('200')
}
