import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { startOfWeek, addDays, format, addWeeks, eachWeekOfInterval, parseISO } from 'date-fns'
import { Segment, Item, Progress, Header, Label, Button } from 'semantic-ui-react'
import { GET_FOUR_WEEKS_QUESTIONS } from 'schema/query'
import _ from 'lodash'
import { Error } from './Error'
import PropTypes from 'prop-types'

export const UpcomingWeeksReport = ({ refetching, onDateSelect }) => {
  const [fourWeeksData, setFourWeekData] = useState([])
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekOne = addDays(startOfCurrentWeek, 8)
  const weekFour = addWeeks(weekOne, 3)
  const weeksRange = eachWeekOfInterval({
    start: weekOne,
    end: weekFour
  }, { weekStartsOn: 2 })

  const { loading, error, data, refetch } = useQuery(GET_FOUR_WEEKS_QUESTIONS, { variables: { startDate: weekOne, endDate: weekFour } })

  useEffect(() => {
    if (data && data.getFourWeeksQuestions) {
      setFourWeekData(data.getFourWeeksQuestions)
    }
    if (refetching) {
      refetch()
    }
  }, [data, refetching])

  const getNumbers = (week, data) => {
    const dataForWeek = _.filter(data, (item) => {
      return format(parseISO(item.weekStartDate), 'yyyy-MM-dd') === format(week, 'yyyy-MM-dd')
    })
    return dataForWeek.length
  }

  return (
    <div>
      <Segment loading={loading}>
        {error && <Error />}
        <Header as='h3'>Progress</Header>
        {_.map(weeksRange, (week) => {
          return (
            <Segment key={week}>
              <Button primary floated='right' onClick={() => onDateSelect(week)}>Click to complete</Button>
              <Item>
                <Item.Content>
                  <Item.Header style={{ marginBottom: '10px' }} as='h4'>{format(week, 'dd MMMM yyyy')}</Item.Header>
                  <Item.Meta style={{ marginBottom: '10px' }}>Questions completed: <Label circular>{getNumbers(week, fourWeeksData)}/10</Label></Item.Meta>
                  <Item.Extra>
                    <Progress style={{ marginBottom: '10px' }} color='green' size='small' percent={getNumbers(week, fourWeeksData) * 100 / 10} />
                  </Item.Extra>
                </Item.Content>
              </Item>
            </Segment>
          )
        })}
      </Segment>
    </div>
  )
}

UpcomingWeeksReport.propTypes = {
  refetching: PropTypes.bool.isRequired,
  onDateSelect: PropTypes.func.isRequired
}
