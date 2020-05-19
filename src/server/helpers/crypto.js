const crypto = require('crypto')

const CMS_ENCRYPT_KEY = 'a15jL0WhzKlj8+iitpkPzg=='
const INITIALIZATION_VECTOR = 'XzXjTylMjudA7fQYt+145A=='

const binaryEncryptionKey = Buffer.from(CMS_ENCRYPT_KEY, 'base64')
const binaryIV = Buffer.from(INITIALIZATION_VECTOR, 'base64')

export const encrypt = (data) => {
  const cipher = crypto.createCipheriv('AES-128-CBC', binaryEncryptionKey, binaryIV)
  return cipher.update(data, 'utf8', 'base64') + cipher.final('base64')
}

export const decrypt = (data) => {
  const decipher = crypto.createDecipheriv('AES-128-CBC', binaryEncryptionKey, binaryIV)
  return decipher.update(data, 'base64', 'utf8') + decipher.final('utf8')
}

export const calculateXHubSignature = (secret, body) => {
  const hmac = crypto.createHmac('sha1', secret)
  hmac.update(body)
  return `sha1=${hmac.digest('hex')}`
}
