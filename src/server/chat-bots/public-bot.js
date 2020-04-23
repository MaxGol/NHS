import createResponseObject from '../services/createResponseObject'
import sendMessage from '../services/sendMessage'
import _ from 'lodash'
import { getPublicUser, createPublicUser, deletePublicUser, updatePublicUser, saveAudioContent } from '../database'

const messages = {
  first_time_user_image: 'https://s3-eu-west-1.amazonaws.com/voxly.client.skills/assets/NHS-BOTS/img/welcome_img.png',
  first_time_user_greeting: 'Hello and thank you for getting involved and supporting those on the frontline of our amazing NHS. In 1914, people on the home-front sent letters to the soldiers fighting away to keep their spirit up. In 2020 our NHS needs some love too! Let’s send them some voice notes to brighten their days. First I need to confirm your age. Are you over 18?',
  under_age: 'Ok, thanks for letting us know. Unfortunately this service is not available for those under the age of 18. Team up with an adult if you’d like to get involved, or pass on this opportunity to others who might be interested. Thanks again and stay safe! 💖',
  age_verified: 'Excellent! Here’s a few more things to consider before we jump in: 🧐Your voice message will be carefully be vetted by the creators of this service, before sending it over to our NHS heroes. The recipients might forward your voice note to someone else and we have no control over who has access to the recording in the future. 🔗Check out the details one our website: thenationalhopeservice.com. Are you happy to continue?',
  incorrect_answer: '🤔 Sorry, I’m not sure I understood you. I’m trying to find out if you are over 18. Just type ‘Yes’ or ‘No’ to proceed.',
  consent_yes: 'Fantastic. You can now record a 20 second audio message for our NHS heroes. 🚨Please remember that this is not an official platform to contact the NHS for medical assistance.',
  consent_no: 'No worries, ping us here, if you change your mind. Stay safe 🏠',
  audio_message_sent_confirmation: 'Thanks, we’ve received your message 👍 Please note, that we won’t be able to let you know whether your message will be forwarded to the NHS staff or not. Unapproved messages will be deleted. Send us a message anytime if you’d like to send another voice note to our wonderful NHS. In the meantime, stay safe! 💞🏡',
  returning_user: '🌈 Let’s spread the love! Record your voice message for our wonderful NHS staff. Just like last time: ⏱The notes can be up to 20 seconds long 🚨For medical assistance contact your GP, as you won’t be able to reach the NHS through this platform 💖Keep it positive to lift the spirit of those working hard on the frontline. Over to you 🎤'
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
      if (messageType === 'text') {
        if (_.toUpper(messagePayload) === 'DELETE') {
          return await deletePublicUser(contact.id)
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
          if (user.over18 && user.consent) {
            const message = createResponseObject('text', messages.returning_user, channelID, contact.id)
            return sendMessage(message)
          }
          if (!user.over18 && _.toUpper(messagePayload) === 'YES') {
            const message = await createResponseObject('text', messages.age_verified, channelID, contact.id)
            await sendMessage(message)
            return updatePublicUser(contact.id, 'over18', true)
          } else if (!user.over18 && _.toUpper(messagePayload) === 'NO') {
            const message = await createResponseObject('text', messages.under_age, channelID, contact.id)
            await sendMessage(message)
            return deletePublicUser(contact.id)
          } else if (user.over18 && _.toUpper(messagePayload) === 'YES') {
            const message = await createResponseObject('text', messages.consent_yes, channelID, contact.id)
            await sendMessage(message)
            return updatePublicUser(contact.id, 'consent', true)
          } else if (user.over18 && _.toUpper(messagePayload) === 'NO') {
            const message = await createResponseObject('text', messages.consent_no, channelID, contact.id)
            await sendMessage(message)
            return deletePublicUser(contact.id)
          } else {
            const message = await createResponseObject('text', messages.incorrect_answer, channelID, contact.id)
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
            // check here if user has already saved voice mesages multiple times
            const message = createResponseObject('text', messages.audio_message_sent_confirmation, channelID, contact.id)
            await sendMessage(message)
            return saveAudioContent(contact, messagePayload)
          } else {
            console.log('--------->>>', messagePayload)
          }
        }
      } else {
        const message = await createResponseObject(messages.greeting, channelID, contact.id)
        await sendMessage(message)
      }
    }
  } catch (error) {
    console.log(error)
  }
  // callback(null, { statusCode: 200, body: JSON.stringify({ message: 'success' }) })
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'success' })
  }
}

// const message = createResponseObject('text', `User exists ${JSON.stringify(user)}`, channelID, contact.id)
// sendMessage(message)
