var AWS = require('aws-sdk')
const fs = require('fs')

const config = {
  accessKeyId: 'AKIAIGRXOFKZLZLFDCSQ',
  region: 'eu-west-1',
  secretAccessKey: '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'
}

AWS.config.update(config)

const fileContent = fs.readFileSync('./src/server/services/email/nhs_verification.html', 'utf8')

var params = {
  Template: {
    TemplateName: 'nhs_verification',
    HtmlPart: fileContent,
    SubjectPart: 'verification - do not reply',
    TextPart: 'Notes from the Nation verification code {{verification_code}}'
  }
}

var templatePromise = new AWS.SES({ apiVersion: '2010-12-01' }).createTemplate(params).promise()

templatePromise
  .then((data) => { console.log(data) })
  .catch((err) => { console.error(err, err.stack) })
