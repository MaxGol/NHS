import React, { useState } from 'react'
import _ from 'lodash'
import { Checkbox, Image, Table, Responsive } from 'semantic-ui-react'
import { teamsImages } from 'common/constants/teams.js'
import { Position } from './Position'

export const ScoreTable = ({ teams, increase }) => {
  const [dataToggle, setDataToggle] = useState(false)
  return (
    <div>
      <Responsive minWidth={768}>
        <Table basic='very' unstackable collapsing verticalAlign='middle' className='leaderboard-table margin-top-0 margin-bottom-20'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Players*</Table.HeaderCell>
              <Table.HeaderCell>Avg. Score*</Table.HeaderCell>
              <Table.HeaderCell>Total Players</Table.HeaderCell>
              <Table.HeaderCell>Overall Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(teams, (item, index) => {
              return (
                <Table.Row key={item.team}>
                  <Table.Cell>{(index + 1) + increase}</Table.Cell>
                  <Table.Cell><Position team={item} /></Table.Cell>
                  <Table.Cell><Image avatar src={teamsImages[item.team].imageUrl} verticalAlign='middle' /></Table.Cell>
                  <Table.Cell>{item.team}</Table.Cell>
                  <Table.Cell>{item.lastWeekCompletedQuizes || 0}</Table.Cell>
                  <Table.Cell>{item.lastWeekAverage || 0}</Table.Cell>
                  <Table.Cell>{item.totalCompletedQuizes || 0}</Table.Cell>
                  <Table.Cell className='overall-score'>{item.avarageScore || 0}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        <p className='small'>
          Players* - Last Week Players<br />
          Avg. Score* - Last Week Average Score
        </p>
      </Responsive>
      <Responsive maxWidth={767}>
        <Checkbox
          toggle
          checked={dataToggle}
          onChange={(e, { checked }) => setDataToggle(checked)}
          className='toggle-scores'
          label={dataToggle ? 'Last Week Average' : 'Overall Average'}
        />
        <Table basic='very' unstackable collapsing verticalAlign='middle' className='leaderboard-table margin-top-0 margin-bottom-20'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>{dataToggle ? 'Players*' : 'Total Players'}</Table.HeaderCell>
              <Table.HeaderCell>{dataToggle ? 'Avg Score*' : 'Overall Score'}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(teams, (item, index) => {
              return (
                <Table.Row key={item.team}>
                  <Table.Cell>{(index + 1) + increase}</Table.Cell>
                  <Table.Cell><Position team={item} /></Table.Cell>
                  <Table.Cell><Image avatar src={teamsImages[item.team].imageUrl} verticalAlign='middle' /></Table.Cell>
                  <Table.Cell>{item.team}</Table.Cell>
                  <Table.Cell>{dataToggle ? (item.lastWeekCompletedQuizes || 0) : (item.totalCompletedQuizes || 0)}</Table.Cell>
                  <Table.Cell className='overall-score'>{dataToggle ? (item.lastWeekAverage || 0) : (item.avarageScore || 0)}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        {dataToggle &&
          <p className='small'>
          Players* - Last Week Players<br />
          Avg. Score* - Last Week Average Score
          </p>}
      </Responsive>
    </div>
  )
}
