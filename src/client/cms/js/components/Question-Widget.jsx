import React, { useState, useEffect } from 'react'
import { Form, Icon, TextArea, Header, Checkbox, Input, Grid } from 'semantic-ui-react'
import classnames from 'classnames'
import _ from 'lodash'
import { format } from 'date-fns'
import PropTypes from 'prop-types'

export const QuestionWidget = ({ league, startDate, question, index, questions, setQuestions, week, successSubmission, setIsValid }) => {
  const [widgetVisibility, setWidgetVisibility] = useState(false)
  const disabledField = week.class === 'live' || week.class === 'archived'
  // const disabledField = false
  const questionWritten = question ? question.questionWritten : ''
  const questionSpoken = question ? question.questionSpoken : ''
  const correctAnswer = question ? question.correctAnswer : ''
  const practiceQ = question ? question.isPracticeQ : 0
  const answer = {
    AWritten: question ? question.answerAWritten : '',
    ASpoken: question ? question.answerASpoken : '',
    BWritten: question ? question.answerBWritten : '',
    BSpoken: question ? question.answerBSpoken : '',
    CWritten: question ? question.answerCWritten : '',
    CSpoken: question ? question.answerCSpoken : ''
  }
  const [validateState, setValidateState] = useState(false)

  const toggleWidget = () => {
    setWidgetVisibility(!widgetVisibility)
  }

  const handleChange = (e, props) => {
    const { name, value } = props
    if (name === 'isPracticeQ') {
      questions[index] = { ...question, [name]: props.checked ? 1 : 0 }
    } else {
      questions[index] = { ...question, [name]: value }
    }
    setQuestions([...questions])
    setIsValid(false)
  }

  useEffect(() => {
    if (question === undefined) {
      question = {
        weekStartDate: format(startDate, 'yyyy-MM-dd'),
        league: league,
        isPracticeQ: 0,
        questionWritten: '',
        questionSpoken: '',
        answerAWritten: '',
        answerASpoken: '',
        answerBWritten: '',
        answerBSpoken: '',
        answerCWritten: '',
        answerCSpoken: '',
        correctAnswer: '',
        isComplete: 0
      }
    }
    setValidateState(!!questionWritten && !!correctAnswer && (!!answer.AWritten && !!answer.BWritten && !!answer.CWritten))
  }, [questionWritten, correctAnswer, answer, practiceQ])

  useEffect(() => {
    if (validateState) {
      questions[index] = { ...question, isComplete: 1 }
      setQuestions([...questions])
    }
  }, [validateState])

  useEffect(() => {
    if (successSubmission) {
      setWidgetVisibility(false)
      setIsValid(true)
    }
  }, [successSubmission])

  return (
    <div className='question-widget-wrapper'>
      <div className={classnames('question-wrapper', { opened: widgetVisibility }, { closed: !widgetVisibility })}>
        {!widgetVisibility && <Header className='question-title' as='h4'>{`Question ${index + 1}`}</Header>}
        {widgetVisibility &&
          <div className='question-box'>
            <Form.Field>
              <label>Question Written</label>
              <TextArea value={questionWritten} name='questionWritten' onChange={handleChange} placeholder='Question' disabled={disabledField} />
            </Form.Field>
            <Form.Field>
              <label>Question Spoken</label>
              <TextArea value={questionSpoken} name='questionSpoken' onChange={handleChange} placeholder='Question' disabled={disabledField} />
            </Form.Field>
            <div className='correct-answer-label'>Correct<br />Answer</div>
            {_.map(['A', 'B', 'C'], (item) => {
              return (
                <Grid key={item} className='answer-grid'>
                  <Grid.Row columns={3} className='padding-bottom-0'>
                    <Grid.Column className='padding-hr-0 padding-top-10' width={4}>{`Written ${item}`}</Grid.Column>
                    <Grid.Column className='padding-hr-0' width={10}>
                      <Input value={answer[`${item}Written`]} name={`answer${item}Written`} onChange={handleChange} className='answer-input' placeholder='Answer' disabled={disabledField} />
                    </Grid.Column>
                    <Grid.Column className='padding-hr-0 padding-top-10' width={2} textAlign='center'>
                      <Checkbox
                        radio
                        name='correctAnswer'
                        value={item}
                        checked={correctAnswer === item}
                        onChange={handleChange}
                        disabled={disabledField}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={3}>
                    <Grid.Column className='padding-hr-0 padding-top-10' width={4}>{`Spoken ${item}`}</Grid.Column>
                    <Grid.Column className='padding-hr-0' width={10}>
                      <Input value={answer[`${item}Spoken`]} name={`answer${item}Spoken`} onChange={handleChange} className='answer-input' placeholder='Answer' disabled={disabledField} />
                    </Grid.Column>
                    <Grid.Column></Grid.Column>
                  </Grid.Row>
                </Grid>
              )
            })}
            <Checkbox label='Practice Question' name='isPracticeQ' checked={!!practiceQ} onChange={handleChange} toggle disabled={disabledField} />
          </div>}
        <div className={classnames('toggle-icon', { off: !widgetVisibility })} onClick={() => toggleWidget()}><Icon circular inverted color='blue' name={widgetVisibility ? 'angle up' : 'angle down'} /></div>
      </div>
      <div className='icon-box'><Icon color={validateState ? 'green' : 'red'} name={validateState ? 'check circle' : 'times circle'} /></div>
    </div>
  )
}

QuestionWidget.propTypes = {
  league: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  question: PropTypes.object,
  index: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
  setQuestions: PropTypes.func.isRequired,
  week: PropTypes.object.isRequired,
  setIsValid: PropTypes.func.isRequired,
  successSubmission: PropTypes.bool.isRequired
}
