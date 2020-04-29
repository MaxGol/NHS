import { SES } from 'aws-sdk'
// import AWSXRay from 'aws-xray-sdk'

const responseHandler = (resolve, reject) => (error, data) => {
  if (error) {
    console.log(error)
    reject(error)
  } else {
    console.log(error)
    resolve(data)
  }
}

const config = {
  accessKeyId: 'AKIAIGRXOFKZLZLFDCSQ',
  region: 'eu-west-1',
  secretAccessKey: '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'
}

const endpoint = process.env.STAGE === 'development' ? `https://email.${config.region}.amazonaws.com` : undefined
const ses = new SES({ ...config.aws, endpoint })
// AWSXRay.captureAWSClient(ses)

const generateDestination = (ToAddresses = [], BccAddresses = [], CcAddresses = []) => {
  return {
    ToAddresses,
    BccAddresses,
    CcAddresses
  }
}

export const sendVerificationEmail = (emailAddress, data) =>
  new Promise((resolve, reject) => {
    ses.sendTemplatedEmail({
      Destination: generateDestination([emailAddress]),
      Source: 'support@thenationalhopeservice.com',
      Template: 'nhs_verification',
      TemplateData: JSON.stringify({
        verification_code: data
      })
    }, responseHandler(resolve, reject))
  })
