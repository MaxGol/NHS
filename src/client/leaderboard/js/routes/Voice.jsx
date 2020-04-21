import React, { useState, useEffect } from 'react'
import { Grid, Header, Loader, Pagination } from 'semantic-ui-react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import { GET_ALL_ANSWERS } from 'schema/query'
import { ScoreTable } from '../components/Score-Table'

export const Voice = () => {
  const { loading, data } = useQuery(GET_ALL_ANSWERS)
  const [teams, setTeams] = useState({
    data: [],
    index: 0
  })
  const [dataChunks, setDataChunks] = useState([])

  useEffect(() => {
    if (data && data.getAllAnswers) {
      setDataChunks(_.chunk(data.getAllAnswers, 10))
      setTeams({
        data: _.chunk(data.getAllAnswers, 10)[0],
        index: 0
      })
    }
  }, [data])

  return (
    <Grid className='padding-top-20 padding-bottom-20'>
      <Grid.Row columns={1} centered>
        <Grid.Column mobile={15} tablet={12} computer={12}>
          <div className='page-title-header blue margin-bottom-20'>
            <Header as='h3'>VOICE LEAGUE</Header>
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1} centered>
        <Grid.Column mobile={15} tablet={12} computer={12}>
          <Loader active={loading} />
          <ScoreTable teams={teams.data} increase={teams.index} />
        </Grid.Column>
      </Grid.Row>
      {dataChunks.length >= 2 &&
        <Grid.Row columns={1} className='margin-top-20' centered>
          <Grid.Column width={16} textAlign='center'>
            <Pagination
              boundaryRange={0}
              defaultActivePage={1}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              totalPages={dataChunks.length}
              onPageChange={(e, { activePage }) => setTeams({ data: dataChunks[activePage - 1], index: activePage === 1 ? 0 : (activePage - 1) * 10 })}
            />
          </Grid.Column>
        </Grid.Row>}
    </Grid>
  )
}
