import gql from 'graphql-tag'

export const IS_LOGGED_IN = gql`
query IsUserLoggedIn {
  isLoggedIn @client
}
`
export const GET_QUESTIONS_BY_DATE = gql`
  query ($date: String!) {
    getAllQuestionsByDate(date: $date) {
      id
      questionWritten
      questionSpoken
      weekStartDate
      league
      isPracticeQ
      answerAWritten
      answerASpoken
      answerBWritten
      answerBSpoken
      answerCWritten
      answerCSpoken
      correctAnswer
      isComplete
    }
  }
`

export const GET_FOUR_WEEKS_QUESTIONS = gql`
  query getFourWeeksQuestions ($startDate: String!, $endDate: String!) {
    getFourWeeksQuestions(startDate: $startDate, endDate: $endDate) {
      weekStartDate
      isComplete
    }
  }
`

export const GET_ALL_ANSWERS = gql`
  query {
    getAllAnswers {
      team
      lastWeekStartDate
      lastWeekCompletedQuizes
      lastWeekScore
      lastWeekAverage
      totalCompletedQuizes
      totalScore
      avarageScore
      positionLastWeek
      positionPreviousWeek
    }
  }
`
