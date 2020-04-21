import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Login } from './routes/Login'
import { LoggedInRoutes } from './routes/Logged-In-routes'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { IS_LOGGED_IN } from 'schema/query'
import Cookies from 'js-cookie'
import { Button, Image, Grid, Container, Menu } from 'semantic-ui-react'
import logo from 'common/images/logo.png'
import voxlyLogo from 'common/images/voxly_digital_logo.png'

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
        <Container style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Grid verticalAlign='middle'>
            <Grid.Column width={11} only='mobile'>
              <Image src={logo} size='tiny' verticalAlign='middle' />{' '}<span className='logo-text-mobile'>Weekly Trivia Quiz</span>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' width={5} only='mobile'>
              <Button size='tiny' floated='right' color='pink' onClick={logout}>Log Out</Button>
            </Grid.Column>
            <Grid.Column width={8} only='tablet computer'>
              <Image src={logo} size='small' verticalAlign='middle' />{' '}<span className='logo-text'>Weekly Trivia Quiz</span>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' width={8} only='tablet computer'>
              <Button floated='right' color='pink' onClick={logout}>Log Out</Button>
            </Grid.Column>
          </Grid>
        </Container>}
      <Switch>
        <Route exact path='/login' component={Login} />
        {isLoggedIn ? <LoggedInRoutes /> : <Redirect to='/login' />}
      </Switch>
      <Menu style={{ backgroundColor: 'transparent' }}>
        <Container style={{ paddingBottom: '20px', paddingTop: '20px' }}>
          <Image centered style={{ maxHeight: '30px' }} src={voxlyLogo} />
        </Container>
      </Menu>
    </BrowserRouter>
  )
}
