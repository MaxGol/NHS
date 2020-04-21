import { getAdminByEmail } from './admin-query'
import {
  getAllQuestions,
  getAllPracticeQuestions,
  getAllNonPracticeQuestions,
  getAllQuestionsByDate,
  getAllQuestionsByDateVoice,
  getFourWeeksQuestions
} from './question-query'
import { getAllAnswers } from './answer-query'

export const queries = {
  Query: {
    getAdminByEmail,
    getAllQuestions,
    getAllPracticeQuestions,
    getAllNonPracticeQuestions,
    getAllQuestionsByDate,
    getAllQuestionsByDateVoice,
    getFourWeeksQuestions,
    getAllAnswers
  }
}
