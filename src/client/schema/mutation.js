import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`

export const UPSERT_QUESTIONS = gql`
  mutation ($questions: [QuestionInput]) {
    upsertQuestions(questions: $questions) {
      id
      weekStartDate
      league
      isPracticeQ
      questionWritten
      questionSpoken
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
