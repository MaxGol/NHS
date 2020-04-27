import createResponseObject from '../services/createResponseObject'
import sendMessage from '../services/sendMessage'
import isAnswerYes from '../services/isAnswerYes'
import _ from 'lodash'
import {
  getPublicUser,
  createPublicUser,
  deletePublicUser,
  updatePublicUser,
  saveAudioContent,
  getAudioContents,
  deleteAllUserRecords,
  createSession,
  getSession,
  deleteSession
} from '../database'

const messages = {
  first_time_user_image: 'https://s3-eu-west-1.amazonaws.com/voxly.client.skills/assets/NHS-BOTS/img/welcome_img.png',
  first_time_user_greeting: 'Hello and thanks for getting involved and supporting our amazing NHS. \n\nIn 1914, people at home sent letters to their loved ones on the front to keep their spirits up. In 2020, our NHS army needs some of the same love. 💙 \n\nFirst up, I need to confirm your age. Are you over 18?',
  under_age: 'Ok, thanks for letting us know. Unfortunately this service is not available for those under the age of 18. Team up with an adult if you’d like to get involved, or pass on this opportunity to others who might be interested. Thanks again and stay safe! 💖',
  age_verified: 'Excellent! Here’s a few more things to consider before we jump in: \n\n🧐Your voice message will be screened by the creators of this service, before sending it over to our NHS heroes. \n\nWe can’t control or stop recipients forwarding on your voice notes to others. But if they are positive messages, hopefully that’s ok. \n\n🔗Check out more details here: thenationalhopeservice.com \n\nAre you happy to continue? Type Yes if you are.',
  invalid_answer_age: '🤔 Sorry, I’m not sure I understood you. Just type ‘Yes’ of you are over 18 or ‘No’ if you are not yet 18.',
  consent_yes: 'Time to send a voice-note and brighten someone’s day! They won\'t be able to respond but trust us, it’s amazingly powerful for our NHS heroes to actually hear you speaking your support. \n🙏 Words of wisdom, encouragement or just a simple thank you will all go down a treat! \n\nOver to you...🎤',
  consent_no: 'No worries, ping us here, if you change your mind. Stay indoors and stay safe.🏠',
  invalid_answer_consent: '🤔 Sorry, I’m not sure I understood you. Are you happy to continue? Just type ‘Yes’ or ‘No’',
  audio_message_sent_confirmation: 'Thank you 👍 We\'ll make sure the people who really need this get to hear it. You can send us another voice-note anytime. \n\nIn the meantime, stay indoors and stay safe. 💞🏡',
  returning_user_entry: '🌈 Let’s spread the love! Record your voice message for our wonderful NHS staff. \n\nJust like last time: \n\n⏱The notes can be up to 20 seconds long \n\n🚨For medical assistance contact your GP, as you won’t be able to reach the NHS through this platform 💖Keep it positive to lift the spirit of those working hard on the frontline. \n\nOver to you 🎤',
  only_three_per_day: 'Thanks for sharing the love! \n💖We can only accept 3 voice notes a day per person. \nCome back again tomorrow to send another if you’d like to though! 🎤',
  different_file_type: '👀 This looks like something else. \n\n For now, you can only send us voice notes up to 20 seconds long. \n Just hold down the record button and then hit send. \n\nGive it another go! 🎤',
  different_file_type_options: [
    '👀 This looks like something else. \n\n For now, you can only send us voice notes up to 20 seconds long. \n Just hold down the record button and then hit send. \n\nGive it another go! 🎤',
    '👀 Hhmm, we\'re only looking for 20 second voice notes for now. Try that again 🎤',
    '🌈 Send our NHS heroes a real, spoken thank you. Just hold down the record button and then hit send...'
  ]
}

export const pbot = async (event, context) => { // callback
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

      const session = await getSession(contact.id)

      if (!session) {
        await createSession(contact.id)
      }

      if (messageType === 'text') {
        if (_.toUpper(messagePayload) === 'DELETE') {
          await deletePublicUser(contact.id)
          await deleteAllUserRecords(contact.id)
          await deleteSession(contact.id)
          return
        }

        const user = await getPublicUser(contact.id)

        if (_.isEmpty(user)) {
          const image = await createResponseObject('image', messages.first_time_user_image, channelID, contact.id)
          await sendMessage(image)
          setTimeout(() => {
            const message = createResponseObject('text', messages.first_time_user_greeting, channelID, contact.id)
            sendMessage(message)
          }, 1000)
          return createPublicUser(contact)
        }

        if (!_.isEmpty(user)) {
          if (user.over18 && user.consent && session) {
            const random = Math.floor(Math.random() * 3)
            const message = createResponseObject('text', messages.different_file_type_options[random], channelID, contact.id)
            return sendMessage(message)
          }

          if (user.over18 && user.consent) {
            const message = createResponseObject('text', messages.returning_user_entry, channelID, contact.id)
            return sendMessage(message)
          }

          if (!user.over18 && isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.age_verified, channelID, contact.id)
            await sendMessage(message)
            return updatePublicUser(contact.id, 'over18', true)
          } else if (!user.over18 && _.toUpper(messagePayload) === 'NO') {
            const message = await createResponseObject('text', messages.under_age, channelID, contact.id)
            await sendMessage(message)
            return deletePublicUser(contact.id)
          } else if (!user.over18 && _.toUpper(messagePayload) !== 'NO' && !user.over18 && isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.invalid_answer_age, channelID, contact.id)
            return sendMessage(message)
          }

          if (user.over18 && isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.consent_yes, channelID, contact.id)
            await sendMessage(message)
            return updatePublicUser(contact.id, 'consent', true)
          } else if (user.over18 && _.toUpper(messagePayload) === 'NO') {
            const message = await createResponseObject('text', messages.consent_no, channelID, contact.id)
            await sendMessage(message)
            return deletePublicUser(contact.id)
          } else if (user.over18 && _.toUpper(messagePayload) !== 'NO' && user.over18 && isAnswerYes(messagePayload)) {
            const message = await createResponseObject('text', messages.invalid_answer_consent, channelID, contact.id)
            return sendMessage(message)
          }
        }
      } else if (messageType === 'audio') {
        const user = await getPublicUser(contact.id)

        if (_.isEmpty(user)) {
          const image = await createResponseObject('image', messages.first_time_user_image, channelID, contact.id)
          await sendMessage(image)
          setTimeout(() => {
            const message = createResponseObject('text', messages.first_time_user_greeting, channelID, contact.id)
            sendMessage(message)
          }, 1000)
          return createPublicUser(contact)
        }

        if (!_.isEmpty(user)) {
          if (user.over18 && user.consent) {
            const records = await getAudioContents(user.id)
            if (records.Count >= 3) {
              const message = createResponseObject('text', messages.only_three_per_day, channelID, contact.id)
              return sendMessage(message)
            }
            await saveAudioContent(contact, messagePayload)
            const message = createResponseObject('text', messages.audio_message_sent_confirmation, channelID, contact.id)
            return sendMessage(message)
          } else {
            const message = await createResponseObject('text', messages.incorrect_answer, channelID, contact.id)
            return sendMessage(message)
          }
        }
      } else {
        const message = await createResponseObject('text', messages.different_file_type, channelID, contact.id)
        return sendMessage(message)
      }
    }
  } catch (error) {
    console.log(error)
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'success' })
  }
}

// if (records.Count === 0) {
//   const message = createResponseObject('text', messages.only_three_per_day, channelID, contact.id)
//   return sendMessage(message)
// }
