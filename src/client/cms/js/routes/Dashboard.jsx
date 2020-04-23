import React from 'react'
import { Container, Segment, Grid, Checkbox } from 'semantic-ui-react'
import ReactPlayer from 'react-player'
import _ from 'lodash'

export const Dashboard = () => {
  const handleChange = (value) => {
    console.log('-------->>>', value)
  }

  const arr = [
    1, 2, 3, 4, 5, 6, 7
  ]
  return (
    <Container style={{ height: '100vh', marginTop: '30px' }}>
      {_.map(arr, el => {
        return (
          <Segment tertiary style={{ marginBottom: '10px' }} key={el}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={2} verticalAlign='middle'>NOTE {`00${el}`}</Grid.Column>
                <Grid.Column width={11}>
                  <ReactPlayer
                    className='react-player'
                    url='https://storage.amio.io/hJxj1advTgzK4gpTRxM4kKF5pA6VRkKLo8cCXcVcFWwGGIkND2O2gJxlE2NE.oga'
                    width='100%'
                    height='100%'
                    controls
                  />
                </Grid.Column>
                <Grid.Column width={2} verticalAlign='middle' textAlign='center'>Approved</Grid.Column>
                <Grid.Column width={1} verticalAlign='middle'>
                  <Checkbox onChange={({check}) => handleChange(check)} toggle />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )
      })}
    </Container>
  )
}
