import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { GET_ALL_RECORDS } from 'schema/query'
import { UPDATE_RECORD } from 'schema/mutation'
import { Container, Segment, Grid, Checkbox } from 'semantic-ui-react'
import ReactPlayer from 'react-player'
import _ from 'lodash'

export const Dashboard = () => {
  const [records, setRecords] = useState([])
  const { loading, data } = useQuery(GET_ALL_RECORDS, { pollInterval: 60000 })
  const [updateVoiceRecord] = useMutation(
    UPDATE_RECORD,
    {
      update (cache, { data: { updateVoiceRecord } }) {
        const { getAllVoiceRecords } = cache.readQuery({ query: GET_ALL_RECORDS })
        const updatedData = _.map(getAllVoiceRecords, rec => {
          if (rec.id === updateVoiceRecord.id) return updateVoiceRecord
          else return rec
        })
        cache.writeQuery({
          query: GET_ALL_RECORDS,
          data: {
            getAllVoiceRecords: updatedData
          }
        })
      }
    }
  )

  useEffect(() => {
    if (data && data.getAllVoiceRecords) {
      setRecords(data.getAllVoiceRecords)
    }
  }, [data])

  const handleChange = async (record, value) => {
    const newRecord = {
      id: record.id,
      content: record.content,
      approved: value ? '1' : '0'
    }
    await updateVoiceRecord({ refetchQueries: [{ query: GET_ALL_RECORDS }], variables: { record: newRecord } })
  }

  const prefixedNumber = (num) => {
    const numLength = `${num}`.split('').length
    if (numLength === 1) return `00${num}`
    else if (numLength === 2) return `0${num}`
    else return `${num}`
  }

  return (
    <Container style={{ height: '100vh', marginTop: '30px' }}>
      {_.map(records, (el, index) => {
        return (
          <Segment loading={loading} tertiary style={{ marginBottom: '10px' }} key={el.id}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={2} verticalAlign='middle'>NOTE {prefixedNumber(index + 1)}</Grid.Column>
                <Grid.Column width={11}>
                  <ReactPlayer
                    className='react-player'
                    url={el.content}
                    width='100%'
                    height='100%'
                    controls
                  />
                </Grid.Column>
                <Grid.Column width={2} verticalAlign='middle' textAlign='center'>Approved</Grid.Column>
                <Grid.Column width={1} verticalAlign='middle'>
                  <Checkbox onChange={(e, { checked }) => handleChange(el, checked)} checked={!!parseInt(el.approved)} toggle />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )
      })}
    </Container>
  )
}
