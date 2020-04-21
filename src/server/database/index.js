import { DynamoDB } from 'aws-sdk'

export const USER_PUBLIC_TABLE = `nhs-chat-bots-${process.env.STAGE}-users-public`
export const AUDIO_CONTENT_TABLE = `nhs-chat-bots-${process.env.STAGE}-audio-content`
export const USER_DOCTORS_TABLE = `nhs-chat-bots-${process.env.STAGE}-users-doctors`
export const ADMIN = `nhs-chat-bots-${process.env.STAGE}-admin`
const endpoint = process.env.STAGE === 'development' ? 'http://localhost:8001' : undefined
const docClient = new DynamoDB.DocumentClient({ service: new DynamoDB({ endpoint }) })

export const getPublicUser = async (id) => {
  try {
    const user = await docClient.get({
      TableName: USER_PUBLIC_TABLE,
      Key: {
        guid: id
      }
    }).promise()
    return user
  } catch (error) {
    console.log(error)
  }
}

export const putPublicUser = async (contact, consent) => {
  try {
    await docClient.put({
      TableName: USER_PUBLIC_TABLE,
      Item: {
        guid: contact.id,
        user: {
          phone: contact.phone,
          name: contact.name,
          consent: consent,
          created: Date.now()
        }
      }
    }).promise()
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
