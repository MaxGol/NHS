const intentMap = {
  'AMAZON.YesIntent': 'YesIntent',
  'AMAZON.NoIntent': 'NoIntent',
  'AMAZON.HelpIntent': 'HelpIntent',
  'AMAZON.CancelIntent': 'END',
  'AMAZON.StopIntent': 'END',
  'AMAZON.FallbackIntent': 'Unhandled',
  'Default Fallback Intent': 'Unhandled',
  'actions.intent.OPTION': 'AnswerQuestion',
  'actions.intent.MAIN': 'LAUNCH',
  launchIntent: 'LAUNCH',
  'AMAZON.RepeatIntent': 'RepeatIntent'
}

module.exports = {
  logging: false,
  intentMap,
  intentsToSkipUnhandled: ['END', 'HelpIntent'],
  user: {
    dataCaching: true,
    metaData: {
      enabled: true
    },
    context: {
      enabled: true
    }
  },
  db: {
    MySQL: {
      tableName: 'user_session',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
      }
    }
  }
}
