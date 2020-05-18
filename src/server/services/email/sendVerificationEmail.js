import { SES } from 'aws-sdk'
// import AWSXRay from 'aws-xray-sdk'

const responseHandler = (resolve, reject) => (error, data) => {
  if (error) {
    console.log(error)
    reject(error)
  } else {
    console.log(error)
    console.log(data)
    resolve(data)
  }
}

const config = {
  accessKeyId: 'AKIAIGRXOFKZLZLFDCSQ',
  region: 'eu-west-1',
  secretAccessKey: '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'
}

const endpoint = process.env.STAGE === 'development' ? `https://email.${config.region}.amazonaws.com` : undefined
const ses = new SES({ ...config, endpoint })
// AWSXRay.captureAWSClient(ses)

const generateDestination = (ToAddresses = [], BccAddresses = [], CcAddresses = []) => {
  return {
    ToAddresses,
    BccAddresses,
    CcAddresses
  }
}

export const sendVerificationEmail = (emailAddress, data) => {
  const promise = new Promise((resolve, reject) => {
    ses.sendTemplatedEmail({
      Destination: generateDestination([emailAddress]),
      Source: 'support@thenationalhopeservice.com',
      Template: 'nhs_verification',
      TemplateData: JSON.stringify({
        verification_code: data
      })
    }, responseHandler(resolve, reject))
  })
  return promise
}

export const sendErrorEmail = (error) => {
  const promise = new Promise((resolve, reject) => {
    ses.sendEmail({
      Destination: generateDestination(['max.g@voxlydigital.com', 'rozzi.meredith@voxlydigital.com', 'freshthinking@voxlydigital.com']),
      Source: 'support@thenationalhopeservice.com',
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: `${error.message}`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Error from NHS Bot'
        }
      }
    }, responseHandler(resolve, reject))
  })
  return promise
}
