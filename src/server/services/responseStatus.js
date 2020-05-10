import isAnswerYes from '../helpers/isAnswerYes'
import isAnswerNo from '../helpers/isAnswerNo'
import _ from 'lodash'
import {
  createUser,
  deleteUser,
  updateUser,
  saveAudioContent,
  getAudioContents,
  deleteAllUserRecords,
  updateSession,
  deleteSession,
  getApprovedAudioContent
} from '../database'

import randomize from 'randomatic'
import { validate } from 'email-validator'
import { sendVerificationEmail } from '../services/email/sendVerificationEmail'

const validEmailDomains = ['nhs.net', 'nhs.uk', 'hscni.net', 'hscni.net', 'scot.nhs.net', 'wales.nhs.et', 'voxlydigital.com']

const domainCheck = (email) => {
  const splitEmail = email.split('@')
  const domain = splitEmail[splitEmail.length - 1]
  return validEmailDomains.includes(domain)
}

export const getResponseStatus = async (user, session, messageType, messagePayload, contact) => {
  const TEXT = messageType === 'text'
  const AUDIO = messageType === 'audio'

  const emailValidationCheck = (email) => {
    if (validate(email) && domainCheck(email)) return { valid: true, type: 'EMAIL_AUTHORIZATION_SENT' }
    else if (!validate(email)) return { valid: false, type: 'GENERIC_EMAIL_VALIDATION_ERROR' }
    else if (!domainCheck(email)) return { valid: false, type: 'NHS_EMAIL_VALIDATION_ERROR' }
  }

  // new user -> no session, no user
  if (_.isEmpty(user) && _.isEmpty(session)) {
    return {
      type: 'FIRST_TIME_USER'
    }
  }

  if (TEXT) {
    // if user types delete, delete user, user's session, user records
    if (_.toUpper(messagePayload) === 'DELETE') {
      await deleteAllUserRecords(contact.id)
      await deleteUser(contact.id)
      await deleteSession(contact.id)
      return {
        type: 'DELETE'
      }
    }

    if (_.toUpper(messagePayload) === 'KILL SESSION') {
      await deleteSession(contact.id)
      return {
        type: 'KILL_SESSION'
      }
    }

    if (_.toUpper(messagePayload) === 'HELP') {
      return {
        type: 'HELP'
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
          authorized: false,
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

    // user exists, session exists, expect user to answer consent questions
    if (!_.isEmpty(user) && !_.isEmpty(session)) {
      if (user.role === 'PUBLIC' && user.over18 === false && isAnswerYes(messagePayload)) {
        await updateUser(user.id, 'over18', true)
        return {
          type: 'USER_IS_OVER_18'
        }
      } else if (user.role === 'PUBLIC' && user.over18 === false && isAnswerNo(messagePayload)) {
        await deleteUser(user.id)
        await deleteSession(session.id)
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
          await deleteSession(session.id)
          return {
            type: 'USER_CONSENT_NO'
          }
        } else {
          await deleteUser(user.id)
          await deleteSession(session.id)
          return {
            type: 'NHS_CONSENT_NO'
          }
        }
      } else if (user.role === 'PUBLIC' && user.consent === false && (!isAnswerNo(messagePayload) || !isAnswerYes(messagePayload))) {
        if (user.role === 'PUBLIC') return { type: 'PUBLIC_INVALID_ANSWER_CONSENT' }
        else return { type: 'NHS_INVALID_ANSWER_CONSENT' }
      }

      // expect email, if email valid, send email to client with authCode
      if (user.role === 'NHS' && user.consent === true && !user.authCode) {
        const emailCheck = emailValidationCheck(messagePayload)
        if (emailCheck.valid) {
          const verificationCode = randomize('0', 5)
          await updateUser(user.id, 'authCode', verificationCode)
          await sendVerificationEmail(messagePayload, verificationCode)
          return {
            type: emailCheck.type
          }
        } else {
          return {
            type: emailCheck.type
          }
        }
      }

      // NHS user shold receive an authcode via email, -if- authcode is valid, user can receive a first audio, -else- user can make 2 errors, after that ask user to resend an email
      if (user.role === 'NHS' && user.consent === true && user.authCode && !user.authorized) {
        if (user.authCode === messagePayload) {
          await updateUser(user.id, 'authorized', true)
          const record = await getApprovedAudioContent(user.records)
          if (_.isEmpty(record)) {
            return {
              type: 'NO_RECORDS'
            }
          } else {
            await updateUser(user.id, 'records', [record.id])
            return {
              type: 'USER_PASSED_REGISTRATION_CAN_RECEIVE_FIRST_AUDIO',
              record: record.content
            }
          }
        } else {
          if (user.errors) {
            if (user.errors.authorization === 1) {
              await updateUser(user.id, 'errors', { authorization: 2 })
              return {
                type: 'VERIFICATION_CODE_INVALID_2'
              }
            } else {
              const userObject = {
                ...user,
                authorized: false,
                authCode: false
              }
              await createUser(userObject)
              return {
                type: 'VERIFICATION_CODE_INVALID_3'
              }
            }
          } else {
            await updateUser(user.id, 'errors', { authorization: 1 })
            return {
              type: 'VERIFICATION_CODE_INVALID_1'
            }
          }
        }
      }

      // expecting "YES" or "NO" from user to approve voice message
      if (session.data.recording) {
        if (isAnswerYes(messagePayload)) {
          const records = await getAudioContents(user.id)
          await saveAudioContent(contact, session.data.recording)
          await updateSession(session.id, 'data', { user: { ...user } })
          return {
            type: `AUDIO_MESSAGE_CONFIRMATION_${records.Count + 1}`
          }
        } else if (isAnswerNo(messagePayload)) {
          await updateSession(session.id, 'data', { user: { ...user } })
          return {
            type: 'AUDIO_MESSAGE_CONFIRMATION_REJECTED'
          }
        } else {
          return {
            type: 'AUDIO_MESSAGE_CONFIRMATION_INCORRECT_ANSWER'
          }
        }
      }

      // NHS has passed all verifications and can receive audio messages right away
      if (user.role === 'NHS' && user.consent === true && user.authCode && user.authorized === true) {
        const record = await getApprovedAudioContent(user.records)
        if (_.isEmpty(record)) {
          return {
            type: 'NO_RECORDS'
          }
        } else {
          await updateUser(contact.id, 'records', [...user.records, record.id])
          return {
            record: record.content
          }
        }
      }

      // PUBLIC user sends text message, but expected to send audio
      if (user.role === 'PUBLIC' && user.over18 === true && user.consent === true) {
        return {
          type: 'DIFFERENT_FILE_TYPE'
        }
      }
    }

    // user exists, session not exists -> returning user after session expired, need to repeat last step
    if (!_.isEmpty(user) && _.isEmpty(session)) {
      if (user.role === 'NHS') {
        if (user.consent === false) {
          return {
            type: 'FIRST_TIME_NHS_USER_GREETING'
          }
        } else if (user.authCode === false) {
          return {
            type: 'NHS_CONSENT_YES'
          }
        } else if (user.authorized === false) {
          return {
            type: 'EMAIL_AUTHORIZATION_SENT'
          }
        } else {
          const record = await getApprovedAudioContent(user.records)
          if (_.isEmpty(record)) {
            return {
              type: 'NO_RECORDS'
            }
          } else {
            await updateUser(contact.id, 'records', [...user.records, record.id])
            return {
              record: record.content
            }
          }
        }
      }
      if (user.role === 'PUBLIC') {
        if (user.over18 === false) {
          return {
            type: 'FIRST_TIME_PUBLIC_USER_GREETING'
          }
        } else if (user.consent === false) {
          return {
            type: 'USER_IS_OVER_18'
          }
        } else {
          return {
            type: 'RETURNING_PUBLIC_USER_TEXT'
          }
        }
      }
    }
  } else if (AUDIO) {
    if ((user.role === 'PUBLIC' && user.over18 === true && user.consent === true) || (user.role === 'NHS' && user.consent === true && user.authCode && user.authorized === true)) {
      const records = await getAudioContents(user.id)
      if (records.Count < 3) {
        await updateSession(user.id, 'data', { recording: messagePayload })
        return {
          type: 'USER_LEFT_VOICE_RECORDING_NOT_CONFIRMED'
        }
      } else {
        return {
          type: 'USER_HAS_LEFT_THREE_VOICE_RECORDINGS'
        }
      }
    } else {
      return {
        type: 'USER_REGISTRATION_NOT_COMPLETE'
      }
    }
  } else {
    return {
      type: 'UNHANDLED_MESSAGE_TYPE'
    }
  }
}
