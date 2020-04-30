var AWS = require('aws-sdk')
const fs = require('fs')

const config = {
  accessKeyId: 'AKIAIGRXOFKZLZLFDCSQ',
  region: 'eu-west-1',
  secretAccessKey: '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'
}

AWS.config.update(config)

const fileContent = fs.readFileSync('./src/server/services/email/nhs_verification.html', 'utf8')

const TemplateName = 'nhs_verification'

var params = {
  Template: {
    TemplateName,
    HtmlPart: fileContent,
    SubjectPart: 'verification - do not reply',
    TextPart: 'Notes from the Nation verification code {{verification_code}}'
  }
}

var templatePromise = new AWS.SES({ apiVersion: '2010-12-01' }).deleteTemplate({ TemplateName }).promise()
console.log(templatePromise)
templatePromise.then(
  function (data) {
    var templatePromise = new AWS.SES({ apiVersion: '2010-12-01' }).createTemplate(params).promise()
    console.log(templatePromise)
    templatePromise.then(
      function (data) {
        console.log(data)
      })
  })
