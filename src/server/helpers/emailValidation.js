import { validate } from 'email-validator'
// import _ from 'lodash'

// const validEmailDomains = [
//   'nhs.net',
//   'nhs.uk',
//   'hscni.net',
//   'hscni.net',
//   'scot.nhs.net',
//   'wales.nhs.et',
//   'ouh.nhs.uk',
//   'berkshire.nhs.uk',
//   'wales.nhs.uk',
//   'wales.nhs.net',
//   'voxlydigital.com'
// ]

// const domainCheck = (email) => {
//   const splitEmail = email.split('@')
//   const domain = splitEmail[splitEmail.length - 1]
//   return validEmailDomains.includes(_.toLower(domain))
// }

// export const emailValidationCheck = (email) => {
//   if (validate(email) && domainCheck(email)) return { valid: true, type: 'EMAIL_AUTHORIZATION_SENT' }
//   else if (!validate(email)) return { valid: false, type: 'GENERIC_EMAIL_VALIDATION_ERROR' }
//   else if (!domainCheck(email)) return { valid: false, type: 'NHS_EMAIL_VALIDATION_ERROR' }
// }

export const emailValidationCheck = (email) => {
  if (validate(email)) return { valid: true, type: 'EMAIL_AUTHORIZATION_SENT' }
  else return { valid: false, type: 'GENERIC_EMAIL_VALIDATION_ERROR' }
}
