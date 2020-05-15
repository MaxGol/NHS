import axios from 'axios'

/* --------------------------------------------------

PUBLIC BOT
  User Creates Voice Message
  User Approves Voice Message

DOCTOR BOT
  User Requests Voice Message
  User Creates Voice Message
  User Approves Voice Message

-------------------------------------------------- */

export const sendAnalytics = (user, event) => {
  if (process.env.STAGE === 'PRODUCTION' || process.env.STAGE === 'STAGING') {
    const GA_ID = user.role === 'PUBLIC' ? process.env.PUBLIC_BOT_ANALYTICS : process.env.DOCTOR_BOT_ANALYTICS
    const userId = user.id

    const params = {
      v: 1,
      tid: GA_ID,
      cid: userId,
      t: 'event',
      ec: event
    }

    return axios.post('https://www.google-analytics.com/collect', null, { params })
  } else {
    console.log('Analytics not sent in: ', process.env.STAGE)
  }
}
