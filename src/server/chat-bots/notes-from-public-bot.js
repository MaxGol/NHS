// import createResponseObject from '../services/createResponseObject'
// import sendMessage from '../services/sendMessage'
// import _ from 'lodash'

// const messages = {
//   greeting: 'Hello <%= name %>, thank you for using our service. Please note that we only accept audio messages.',
//   thank_you: 'Thank you for your voice messagge'
// }

// const responseHandler = (status) => {
//   return {
//     statusCode: status,
//     body: JSON.stringify({ message: 'success' })
//   }
// }

// export const dbot = async (event, context) => {
//   context.callbackWaitsForEmptyEventLoop = false
//   const request = JSON.parse(event.body)

//   try {
//     if (request.event === 'message_received') {
//       const channelID = request.data.channel.id
//       const messageType = request.data.content.type
//       const messagePayload = request.data.content.payload
//       const contact = {
//         id: request.data.contact.id,
//         phone: request.data.contact.platform_id,
//         name: request.data.contact.name
//       }

//       const user = await getPublicUser(contact.id)
//       const session = await getSession(contact.id)

//       if (!session) {
//         await createSession(contact.id)
//       }

//       const sendMessageWithDelay = async (fn, param, ms) => {
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             resolve(fn(param))
//           }, ms)
//         })
//       }

//       if (messageType === 'text') {
//         if (_.toUpper(messagePayload) === 'DELETE') {
//           await deleteDoctorUser(contact.id)
//           await deleteSession(contact.id)
//           const message = createResponseObject('text', `${contact.name} has been deleted`, channelID, contact.id)
//           await sendMessage(message)
//           return responseHandler('200')
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error)
//     return responseHandler('400')
//   }
//   return responseHandler('200')
// }

// // const event = {
// //   event: 'message_received',
// //   timestamp: '2020-04-15T13:21:47.228Z',
// //   data:
// //     {
// //       id: '6656179703726752429',
// //       channel: {
// //         id: '6656110508678857542',
// //         type: 'whatsapp'
// //       },
// //       contact: {
// //         id: '6656127826909748194',
// //         platform_id: '447739365430',
// //         name: 'Max' },
// //       content: {
// //         type: 'text',
// //         payload: 'Test'
// //       }
// //     }
// //   }
