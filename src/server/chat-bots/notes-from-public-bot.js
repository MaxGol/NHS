import createResponseObject from '../services/createResponseObject'
import sendMessage from '../services/sendMessage'
import _ from 'lodash'

export const dbot = async (event, context, callback) => {
  callback(null, { statusCode: 200, body: JSON.stringify({ message: 'success' }) })
  const request = JSON.parse(event.body)

  const messages = {
    greeting: 'Hello <%= name %>, thank you for using our service. Please note that we only accept audio messages.',
    thank_you: 'Thank you for your voice messagge'
  }

  try {
    if (request.event === 'message_received') {
      const channelID = request.data.channel.id
      const messageType = request.data.content.type
      const contact = {
        id: request.data.contact.id,
        phone: request.data.contact.platform_id,
        name: request.data.contact.name
      }
      if (messageType === 'text') {
        const compiled = _.template(messages.greeting)
        const messageText = compiled({ name: contact.name })
        const message = await createResponseObject(messageType, messageText, channelID, contact.id)
        await sendMessage(message)
      }
      if (messageType === 'audio') {
        const message = await createResponseObject('text', messages.thank_you, channelID, contact.id)
        await sendMessage(message)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// const event = {
//   event: 'message_received',
//   timestamp: '2020-04-15T13:21:47.228Z',
//   data:
//     {
//       id: '6656179703726752429',
//       channel: {
//         id: '6656110508678857542',
//         type: 'whatsapp'
//       },
//       contact: {
//         id: '6656127826909748194',
//         platform_id: '447739365430',
//         name: 'Max' },
//       content: {
//         type: 'text',
//         payload: 'Test'
//       }
//     }
//   }
