import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Login } from './routes/Login'
import { Dashboard } from './routes/Dashboard'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { IS_LOGGED_IN } from 'schema/query'
import Cookies from 'js-cookie'
import { Button, Grid, Container } from 'semantic-ui-react'

export const Routes = () => {
  const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN)
  const client = useApolloClient()
  const logout = () => {
    Cookies.remove('accessToken')
    client.writeData({ data: { isLoggedIn: false } })
  }

  return (
    <BrowserRouter>
      {isLoggedIn &&
        <Container style={{ marginTop: '30px' }}>
          <Grid verticalAlign='middle'>
            <Grid.Column verticalAlign='middle' width={16} only='mobile'>
              <Button size='tiny' floated='right' color='pink' onClick={logout}>Log Out</Button>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' width={16} only='tablet computer'>
              <Button floated='right' color='pink' onClick={logout}>Log Out</Button>
            </Grid.Column>
          </Grid>
        </Container>}
      <Switch>
        <Route exact path='/login' component={Login} />
        {isLoggedIn ? <Route exact path='/' component={Dashboard} /> : <Redirect to='/login' />}
      </Switch>
    </BrowserRouter>
  )
}
