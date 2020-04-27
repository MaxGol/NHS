import axios from 'axios'

/**
 * @param {data} message - The message object
 */

export default async (data) => {
  const headers = {
    headers: {
      authorization: `Bearer ${process.env.BOT_ACCESS_TOKEN}`
    }
  }

  try {
    return await axios.post('https://api.amio.io/v1/messages', data, headers)
  } catch (error) {
    console.log(error)
  }
}
