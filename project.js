// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  stages: {
    local: {
      alexaSkill: {
        languageModel: { 'en-gb': { invocation: 'match of the day local' } },
        endpoint: 'https://match-of-the-day-voice.eu.ngrok.io/webhook',
        skillId: 'amzn1.ask.skill.99e29049-d3a7-4cef-bc6d-5eb819445830'
      },
      googleAction: {
        dialogflow: {
          endpoint: 'https://match-of-the-day-voice.eu.ngrok.io/webhook',
          projectId: 'match-of-the-day-local',
          keyFile: './src/server/voice-service/service-accounts/local.json'
        }
      }
    },
    staging: {
      alexaSkill: {
        languageModel: { 'en-gb': { invocation: 'match of the day dev' } },
        endpoint: 'arn:aws:lambda:eu-west-1:393767856149:function:match-of-the-day-staging-speech',
        skillId: 'amzn1.ask.skill.6d871df9-0616-4fe0-86bc-dbf315decc86'
      },
      googleAction: {
        dialogflow: {
          endpoint: 'https://vy63zhxvz3.execute-api.eu-west-1.amazonaws.com/staging/webhook',
          projectId: 'match-of-the-day-staging',
          keyFile: './src/server/voice-service/service-accounts/staging.json'
        }
      }
    },
    production: {
      alexaSkill: {
        languageModel: { 'en-gb': { invocation: 'match of the day magazine' } },
        endpoint: 'arn:aws:lambda:eu-west-1:393767856149:function:match-of-the-day-production-speech',
        skillId: 'amzn1.ask.skill.b4e2181d-9912-4214-b0ce-91572649c8ca'
      },
      googleAction: {
        dialogflow: {
          endpoint: 'https://lyolol141a.execute-api.eu-west-1.amazonaws.com/production/webhook',
          projectId: 'match-of-the-day',
          keyFile: './src/server/voice-service/service-accounts/production.json'
        }
      }
    }
  }
}
