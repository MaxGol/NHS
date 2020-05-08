import isAnswerYes from '../helpers/isAnswerYes'
import isAnswerNo from '../helpers/isAnswerNo'
import _ from 'lodash'
import {
  // getUser,
  createUser,
  deleteUser,
  updateUser,
  // saveAudioContent,
  // getAudioContents,
  deleteAllUserRecords,
  // createSession,
  // getSession,
  // updateSession,
  deleteSession
} from '../database'

export const getResponseStatus = async (user, session, messageType, messagePayload, channelID, contact) => {
  const TEXT = messageType === 'text'
  const AUDIO = messageType === 'audio'

  // new user -> no session, no user
  if (_.isEmpty(user) && _.isEmpty(session)) {
    return {
      type: 'FIRST_TIME_USER'
    }
  }

  if (TEXT) {
    if (_.toUpper(messagePayload) === 'DELETE') {
      await deleteAllUserRecords(contact.id)
      await deleteUser(contact.id)
      await deleteSession(contact.id)
      return {
        type: 'DELETE'
      }
    }

    // new user -> has received first message should respond with "support or nhs"
    if (_.isEmpty(user) && !_.isEmpty(session)) {
      if (_.toUpper(messagePayload) === 'SUPPORT') {
        const userObject = {
          id: session.id,
          role: 'PUBLIC',
          over18: false,
          consent: false
        }
        await createUser(userObject)
        return {
          type: 'USER_WANTS_TO_REGISTER_AS_PUBLIC'
        }
      } else if (_.toUpper(messagePayload) === 'NHS') {
        const userObject = {
          id: session.id,
          role: 'NHS',
          consent: false,
          emailSent: false,
          authCode: false
        }
        await createUser(userObject)
        return {
          type: 'USER_WANTS_TO_REGISTER_AS_NHS'
        }
      } else {
        return {
          type: 'PROFILE_TYPE_ERROR'
        }
      }
    }

    // user exists, session exists
    if (!_.isEmpty(user) && !_.isEmpty(session)) {
      if (user.role === 'PUBLIC' && user.over18 === false && isAnswerYes(messagePayload)) {
        await updateUser(user.id, 'over18', true)
        return {
          type: 'USER_IS_OVER_18'
        }
      } else if (user.role === 'PUBLIC' && user.over18 === false && isAnswerNo(messagePayload)) {
        await deleteUser(user.id)
        return {
          type: 'USER_IS_UNDER_18'
        }
      } else if (user.role === 'PUBLIC' && user.over18 === false && (!isAnswerNo(messagePayload) || !isAnswerYes(messagePayload))) {
        return {
          type: 'USER_AGE_INVALID_ANSWER'
        }
      }

      if ((user.role === 'PUBLIC' || user.role === 'NHS') && user.consent === false && isAnswerYes(messagePayload)) {
        if (user.role === 'PUBLIC') {
          await updateUser(user.id, 'consent', true)
          return {
            type: 'USER_CONSENT_YES'
          }
        } else {
          await updateUser(user.id, 'consent', true)
          return {
            type: 'NHS_CONSENT_YES'
          }
        }
      } else if ((user.role === 'PUBLIC' || user.role === 'NHS') && user.consent === false && isAnswerNo(messagePayload)) {
        if (user.role === 'PUBLIC') {
          await deleteUser(user.id)
          return {
            type: 'USER_CONSENT_NO'
          }
        } else {
          await deleteUser(user.id)
          return {
            type: 'NHS_CONSENT_NO'
          }
        }
      } else if (user.role === 'PUBLIC' && user.consent === false && (!isAnswerNo(messagePayload) || !isAnswerYes(messagePayload))) {
        if (user.role === 'PUBLIC') return { type: 'PUBLIC_INVALID_ANSWER_CONSENT' }
        else return { type: 'NHS_INVALID_ANSWER_CONSENT' }
      }
    }

    // user exists, session not exists -> returning user after session expired
    if (!_.isEmpty(user) && _.isEmpty(session)) {

    }
  } else if (AUDIO) {

  } else {
    return {
      type: 'UNHANDLED',
      user,
      session
    }
  }
}
