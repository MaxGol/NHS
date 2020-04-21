/**
 * @param {string} type - The type of message
 * @param {string} payload - The payload of the message
 * @param {string} channelID - The channelID
 * @param {string} contactID - The contactID
 */
export default (type = 'text', payload, channelID, contactID) => {
  const message = {
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
  return message
}
