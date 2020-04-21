import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import { Container, Form, Grid, Header, Button, Icon, Segment } from 'semantic-ui-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { enGB } from 'date-fns/esm/locale'
import { getISOWeek, getYear, format, parseISO } from 'date-fns'
// import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import classnames from 'classnames'
import _ from 'lodash'
import { UPSERT_QUESTIONS } from 'schema/mutation'
import { GET_QUESTIONS_BY_DATE } from 'schema/query'
import { QuestionWidget } from '../components/Question-Widget'
import { SuccessSubmission } from '../components/Success-Submission'
import { Error } from '../components/Error'
import { UpcomingWeeksReport } from '../components/Upcoming-Weeks-Report'

registerLocale('en', enGB)

export const Entry = () => {
  const [error, setError] = useState(false)
  const [successSubmission, setSuccessSubmission] = useState(false)
  const [upsertQuestions, setUpsertQuestions] = useState([])
  const [isValid, setIsValid] = useState(true)
  const [questionsC, setQuestionsC] = useState(new Array(5))
  const [questionsP, setQuestionsP] = useState(new Array(5))
  const [startDate, setStartDate] = useState()
  const [week, setWeek] = useState({
    class: '',
    text: ''
  })

  const [getQuestions, { loading: queryLoading, error: queryError, data }] = useLazyQuery(GET_QUESTIONS_BY_DATE)
  const [createUpdateQuestions, { loading: mutationLoading, error: mutationError }] = useMutation(UPSERT_QUESTIONS)

  const isWeekday = date => {
    const day = date.getDay()
    return day === 2
  }

  // useEffect(() => {
  //   if (startDate) {
  //     if (moment().year() > moment(startDate).year() || moment().isoWeek() > moment(startDate).isoWeek()) {
  //       setWeek({
  //         class: 'archived',
  //         text: 'Archived Week'
  //       })
  //     } else if (moment().isoWeek() === moment(startDate).isoWeek()) {
  //       setWeek({
  //         class: 'live',
  //         text: 'Live Week'
  //       })
  //     } else {
  //       setWeek({
  //         class: 'upcoming',
  //         text: 'Upcoming Week'
  //       })
  //     }
  //   }
  // }, [startDate])

  useEffect(() => {
    if (startDate) {
      if (getYear(new Date()) > getYear(startDate) || getISOWeek(new Date()) > getISOWeek(startDate)) {
        setWeek({
          class: 'archived',
          text: 'Archived Week'
        })
      } else if (getISOWeek(new Date()) === getISOWeek(startDate)) {
        setWeek({
          class: 'live',
          text: 'Live Week'
        })
      } else {
        setWeek({
          class: 'upcoming',
          text: 'Upcoming Week'
        })
      }
    }
  }, [startDate])

  useEffect(() => {
    if (queryError || mutationError) {
      setError(true)
    }
    if (data && data.getAllQuestionsByDate) {
      const questions = data.getAllQuestionsByDate
      const championship = _.orderBy(_.filter(questions, (question) => question.league === 'Sunday League'), ['isComplete'], ['desc'])
      const premier = _.orderBy(_.filter(questions, (question) => question.league === 'Pro League'), ['isComplete'], ['desc'])
      setQuestionsC([...championship, ...new Array(5 - championship.length)])
      setQuestionsP([...premier, ...new Array(5 - premier.length)])
    }
  }, [data, queryError, mutationError])

  useEffect(() => {
    const combinedQuestions = _.filter([...questionsC, ...questionsP], question => question !== undefined)
    setUpsertQuestions(combinedQuestions)
  }, [questionsC, questionsP])

  const onDateSelect = (date) => {
    setSuccessSubmission(false)
    if (date) {
      const formatedDate = format(date, 'yyyy-MM-dd')
      setStartDate(date)
      getQuestions({ variables: { date: formatedDate } })
    }
  }

  const back = (e) => {
    setStartDate()
  }

  const formatAllQuestions = (questions) => {
    const filteredQuestions = _.map(questions, question => {
      if (!question.questionSpoken) {
        question.questionSpoken = question.questionWritten
      }
      if (!question.answerASpoken) {
        question.answerASpoken = question.answerAWritten
      }
      if (!question.answerBSpoken) {
        question.answerBSpoken = question.answerBWritten
      }
      if (!question.answerCSpoken) {
        question.answerCSpoken = question.answerCWritten
      }
      if (question.id) {
        question.weekStartDate = format(parseISO(question.weekStartDate), 'yyyy-MM-dd')
      }
      return question
    })
    return filteredQuestions
  }

  const submit = async (e) => {
    e.preventDefault()
    setSuccessSubmission(false)
    try {
      const response = await createUpdateQuestions({ refetchQueries: [{ query: GET_QUESTIONS_BY_DATE, variables: { date: format(startDate, 'yyyy-MM-dd') } }], variables: { questions: formatAllQuestions(upsertQuestions) } })
      if (response) {
        setSuccessSubmission(true)
      }
    } catch (error) {
      console.log(error)
      setError(true)
    }
  }

  return (
    <div>
      {error && <Error />}
      {successSubmission && <SuccessSubmission setSuccessSubmission={setSuccessSubmission} />}
      <Form onSubmit={submit}>
        <Container style={{ marginBottom: '20px' }}>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={8} computer={4}>
                <Header as='h3' style={{ color: 'white' }}>Pick Game Week</Header>
                <DatePicker
                  locale='en'
                  selected={startDate}
                  onChange={date => onDateSelect(date)}
                  filterDate={isWeekday}
                  placeholderText='Select a weekday'
                />
              </Grid.Column>
              <Grid.Column mobile={8} computer={4}>
                {startDate && <div className={classnames('week-indicator', week.class)}>{week.text}</div>}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        {!startDate &&
          <Container>
            <UpcomingWeeksReport
              refetching={successSubmission}
              onDateSelect={onDateSelect}
            />
          </Container>}
        {
          startDate &&
            <div>
              <Container style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Segment loading={queryLoading || mutationLoading}>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column mobile={16} tablet={8} computer={8}>
                        <Header as='h3'>Sunday League (Easy)</Header>
                        {_.map(questionsC, (item, index) => {
                          return (
                            <QuestionWidget
                              key={index}
                              league='Sunday League'
                              startDate={startDate}
                              question={item}
                              questions={questionsC}
                              setQuestions={setQuestionsC}
                              index={index}
                              week={week}
                              successSubmission={successSubmission}
                              setIsValid={setIsValid}
                            />
                          )
                        })}
                      </Grid.Column>
                      <Grid.Column mobile={16} tablet={8} computer={8}>
                        <Header as='h3'>Pro League (Hard)</Header>
                        {_.map(questionsP, (item, index) => {
                          return (
                            <QuestionWidget
                              key={index}
                              league='Pro League'
                              startDate={startDate}
                              question={item}
                              questions={questionsP}
                              setQuestions={setQuestionsP}
                              index={index}
                              week={week}
                              successSubmission={successSubmission}
                              setIsValid={setIsValid}
                            />
                          )
                        })}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Container>
              <Container style={{ paddingBottom: '20px' }}>
                {(week.class !== 'live' && week.class !== 'archived') &&
                  <Button color='red' className='submit-btn' type='submit' disabled={isValid}>Save</Button>}
                {/* <Button color='red' className='submit-btn' type='submit' disabled={isValid}>Save</Button> */}
                <Button color='green' icon labelPosition='right' onClick={back}>Back<Icon name='left arrow' /></Button>
              </Container>
            </div>
        }
      </Form>
    </div>
  )
}
