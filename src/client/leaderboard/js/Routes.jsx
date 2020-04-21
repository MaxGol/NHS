import React from 'react'
import { Container } from 'semantic-ui-react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { HeaderNavigation } from './components/Header-Navigation'
import { Footer } from './components/Footer'
import { Voice } from './routes/Voice'
import { Rules } from './routes/Rules'
import { HowToPlay } from './routes/How-to-play'

export const Routes = () => {
  return (
    <BrowserRouter>
      <div className='liner' />
      <Container className='black-border'>
        <div className='content'>
          <HeaderNavigation />
          <div className='divider' />
          <Switch>
            <Route exact path='/' component={Voice} />
            <Route exact path='/rules' component={Rules} />
            <Route exact path='/how-to-play' component={HowToPlay} />
          </Switch>
        </div>

        <Footer />

      </Container>
      <div className='liner' />
    </BrowserRouter>
  )
}
