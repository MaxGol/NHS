/**
 * @param {string} type - The type of message
 * @param {string} payload - The payload of the message
 * @param {string} channelID - The channelID
 * @param {string} contactID - The contactID
 */
export default (type, payload, channelID, contactID) => {
  let message = {}
  if (type === 'text') {
    message = {
      channel: {
        id: channelID
      },
      contact: {
        id: contactID
      },
      content: {
        type: type,
        payload: payload
      }
    }
  }
  if (type === 'image') {
    message = {
      channel: {
        id: channelID
      },
      contact: {
        id: contactID
      },
      content: {
        type: type,
        payload: {
          url: payload
        }
      }
    }
  }
  return message
}
