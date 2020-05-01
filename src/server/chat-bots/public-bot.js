import createResponseObject from '../services/createResponseObject'
import sendMessage from '../services/sendMessage'
import isAnswerYes from '../services/isAnswerYes'
import _ from 'lodash'
import {
  getUser,
  createUser,
  deleteUser,
  updateUser,
  saveAudioContent,
  getAudioContents,
  deleteAllUserRecords,
  createSession,
  getSession,
  updateSession,
  deleteSession
} from '../database'
import * as DB from '../database/tables'

const messages = {
  first_time_user_image: 'https://s3-eu-west-1.amazonaws.com/voxly.client.skills/assets/NHS-BOTS/img/welcome_img.png',
  first_time_user_greeting: 'Hello and thanks for getting involved and supporting our amazing NHS. \n\nIn 1914, people at home sent letters to their loved ones on the front to keep their spirits up. In 2020, our NHS army needs some of the same love. 💙 \n\nFirst up, I need to confirm your age. Are you over 18?',
  under_age: 'Ok, thanks for letting us know. Unfortunately this service is not available for those under the age of 18. Team up with an adult if you’d like to get involved, or pass on this opportunity to others who might be interested. Thanks again and stay safe! 💖',
  age_verified: 'Excellent! Here’s a few more things to consider before we jump in: \n\n🧐Your voice message will be screened by the creators of this service, before sending it over to our NHS heroes. \n\nWe can’t control or stop recipients forwarding on your voice notes to others. But if they are positive messages, hopefully that’s ok. \n\n🔗Check out more details here: thenationalhopeservice.com \n\nAre you happy to continue? Type Yes if you are.',
  invalid_answer_age: '🤔 Sorry, I’m not sure I understood you. Just type ‘Yes’ of you are over 18 or ‘No’ if you are not yet 18.',
  consent_yes: 'Time to send a voice-note and brighten someone’s day! They won\'t be able to respond but trust us, it’s amazingly powerful for our NHS heroes to actually hear you speaking your support. \n\n🙏 Words of wisdom, encouragement or just a simple thank you will all go down a treat! \n\nOver to you...🎤',
  consent_no: 'No worries, ping us here, if you change your mind. Stay indoors and stay safe.🏠',
  invalid_answer_consent: '🤔 Sorry, I’m not sure I understood you. Are you happy to continue? Just type ‘Yes’ or ‘No’',
  audio_message_sent_confirmation_1: 'Thank you 👍 We\'ll make sure the people who really need this get to hear it. Send us another voice note or share this number with others to help us collect as many as possible. ☎️  \n\nIn the meantime, stay indoors and stay safe. 💞🏡',
  audio_message_sent_confirmation_2: 'Keeping all our key workers\' spirits lifted is so important in this time. You\'ll have just helped them feel less alone. ☎️ Please share this number with others to help us keep collecting these lovely messages for the people who need to hear them.',
  audio_message_sent_confirmation_3: 'We might be finding a new normal but our key workers\' will be fighting this battle for long time to come. Knowing that they have your support will mean the world 🌍 Thank you.',
  returning_user_entry: '🌈 Let’s spread the love! Record your voice message for our wonderful NHS staff. \n\nJust like last time: \n\n⏱The notes can be up to 20 seconds long \n\n🚨For medical assistance contact your GP, as you won’t be able to reach the NHS through this platform 💖Keep it positive to lift the spirit of those working hard on the frontline. \n\nOver to you 🎤',
  only_three_per_day: 'Thanks for sharing the love! \n💖We can only accept 3 voice notes a day per person. \nCome back again tomorrow to send another if you’d like to though! 🎤',
  different_file_type: '👀 This looks like something else. \n\n For now, you can only send us voice notes up to 20 seconds long. \n Just hold down the record button and then hit send. \n\nGive it another go! 🎤',
  different_file_type_options: [
    '👀 This looks like something else. \n\n For now, you can only send us voice notes up to 20 seconds long. \n Just hold down the record button and then hit send. \n\nGive it another go! 🎤',
    '👀 Hhmm, we\'re only looking for 20 second voice notes for now. Try that again 🎤',
    '🌈 Send our NHS heroes a real, spoken thank you. Just hold down the record button and then hit send...'
  ]
}

const responseHandler = (status) => {
  return {
    statusCode: status
  }
}

export const pbot = async (event, context) => { // callback
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

      const user = await getUser(DB.USER_PUBLIC_TABLE, contact.id)
      const session = await getSession(contact.id)

      console.log('--------------> USER', user)
      console.log('--------------> SESSION', session)

      if (!session) await createSession(contact.id, { user })
      else await updateSession(contact.id, 'user', user)

      const sendMessageWithDelay = async (fn, param, ms) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fn(param))
          }, ms)
        })
      }

      if (messageType === 'text') {
        if (_.toUpper(messagePayload) === 'DELETE') {
          await deleteAllUserRecords(contact.id)
          await deleteUser(DB.USER_PUBLIC_TABLE, contact.id)
          await deleteSession(contact.id)
          const message = createResponseObject('text', `${contact.name} has been deleted`, channelID, contact.id)
          await sendMessage(message)
          return responseHandler('200')
        }

        if (_.isEmpty(user)) {
          const image = createResponseObject('image', messages.first_time_user_image, channelID, contact.id)
          const message = createResponseObject('text', messages.first_time_user_greeting, channelID, contact.id)
          await sendMessage(image)
          await sendMessageWithDelay(sendMessage, message, 1000)
          await createUser(DB.USER_PUBLIC_TABLE, contact)
          return responseHandler('200')
        }

        if (!_.isEmpty(user)) {
          if (user.over18 && user.consent && session) {
            const random = Math.floor(Math.random() * 3)
            const message = createResponseObject('text', messages.different_file_type_options[random], channelID, contact.id)
            await sendMessage(message)
            return responseHandler('200')
          }

          if (user.over18 && user.consent) {
            const message = createResponseObject('text', messages.returning_user_entry, channelID, contact.id)
            await sendMessage(message)
            return responseHandler('200')
          }

          if (!user.over18 && isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.age_verified, channelID, contact.id)
            await sendMessage(message)
            await updateUser(DB.USER_PUBLIC_TABLE, contact.id, 'over18', true)
            return responseHandler('200')
          } else if (!user.over18 && _.toUpper(messagePayload) === 'NO') {
            const message = await createResponseObject('text', messages.under_age, channelID, contact.id)
            await sendMessage(message)
            await deleteUser(DB.USER_PUBLIC_TABLE, contact.id)
            return responseHandler('200')
          } else if (!user.over18 && _.toUpper(messagePayload) !== 'NO' && !user.over18 && !isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.invalid_answer_age, channelID, contact.id)
            await sendMessage(message)
            return responseHandler('200')
          }

          if (user.over18 && isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.consent_yes, channelID, contact.id)
            await sendMessage(message)
            await updateUser(DB.USER_PUBLIC_TABLE, contact.id, 'consent', true)
            return responseHandler('200')
          } else if (user.over18 && _.toUpper(messagePayload) === 'NO') {
            const message = await createResponseObject('text', messages.consent_no, channelID, contact.id)
            await sendMessage(message)
            await deleteUser(DB.USER_PUBLIC_TABLE, contact.id)
            return responseHandler('200')
          } else if (user.over18 && _.toUpper(messagePayload) !== 'NO' && user.over18 && !isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.invalid_answer_consent, channelID, contact.id)
            await sendMessage(message)
            return responseHandler('200')
          }
        }
      } else if (messageType === 'audio') {
        const user = await getUser(DB.USER_PUBLIC_TABLE, contact.id)

        if (_.isEmpty(user)) {
          const image = createResponseObject('image', messages.first_time_user_image, channelID, contact.id)
          const message = createResponseObject('text', messages.first_time_user_greeting, channelID, contact.id)
          await sendMessage(image)
          await sendMessageWithDelay(sendMessage, message, 1000)
          await createUser(DB.USER_PUBLIC_TABLE, contact)
          return responseHandler('200')
        }

        if (!_.isEmpty(user)) {
          if (user.over18 && user.consent) {
            const records = await getAudioContents(user.id)

            if (records.Count === 0) {
              await saveAudioContent(contact, messagePayload)
              const message = createResponseObject('text', messages.audio_message_sent_confirmation_1, channelID, contact.id)
              await sendMessage(message)
              return responseHandler('200')
            }
            if (records.Count === 1) {
              await saveAudioContent(contact, messagePayload)
              const message = createResponseObject('text', messages.audio_message_sent_confirmation_2, channelID, contact.id)
              await sendMessage(message)
              return responseHandler('200')
            }
            if (records.Count === 2) {
              await saveAudioContent(contact, messagePayload)
              const message = createResponseObject('text', messages.audio_message_sent_confirmation_3, channelID, contact.id)
              await sendMessage(message)
              return responseHandler('200')
            }
            if (records.Count === 3) {
              const message = createResponseObject('text', messages.only_three_per_day, channelID, contact.id)
              await sendMessage(message)
              return responseHandler('200')
            }
          } else {
            const message = await createResponseObject('text', messages.different_file_type, channelID, contact.id)
            await sendMessage(message)
            return responseHandler('200')
          }
        }
      } else {
        const message = await createResponseObject('text', messages.different_file_type, channelID, contact.id)
        await sendMessage(message)
        return responseHandler('200')
      }
    } else {
      return responseHandler('200')
    }
  } catch (error) {
    console.log(error)
    return responseHandler('400')
  }
  return responseHandler('200')
}
