import { sign, verify } from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-lambda'

export const createAccessToken = (adminId) => {
  return sign({ adminId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d'
  })
}

export const isAuth = (context) => {
  const token = context.headers.Authorization
  if (!token) {
    throw new AuthenticationError('Not authenticated')
  }

  try {
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        throw new AuthenticationError('Not authenticated')
      } else {
        context.payload = payload
      }
    })
  } catch (error) {
    console.log(error)
    throw new AuthenticationError('Not authenticated')
  }
  return true
}
