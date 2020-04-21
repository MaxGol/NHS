import React from 'react'
import { Grid, Image } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom'
import motdRectLogo from 'common/images/motd_rect_logo.png'
import bbcLogo from 'common/images/bbc_bw.png'
import subscribe from 'common/images/subscribe.png'
import classnames from 'classnames'

export const HeaderNavigation = () => {
  const { pathname } = useLocation()
  return (
    <Grid>
      <Grid.Row columns={3} className='leaderboard-logo' centered>
        <Grid.Column mobile={4} tablet={5} computer={5} className='link-wrap'>
          <Image as='a' target='blank' href='https://www.bbc.co.uk/sport/football' className='bbc-logo' src={bbcLogo} floated='left' />
        </Grid.Column>
        <Grid.Column mobile={7} tablet={5} computer={5}>
          <Image as='a' href='https://motdmag.com/' src={motdRectLogo} />
        </Grid.Column>
        <Grid.Column mobile={4} tablet={5} computer={5} className='link-wrap'>
          <Image as='a' target='blank' href='https://motdmag.com/subscribe/' className='subscribe-logo' src={subscribe} floated='right' />
        </Grid.Column>
      </Grid.Row>

      {/* <Grid.Row columns={2} className='bbc-subscribe'>
        <Grid.Column as='a' target='blank' href='https://www.bbc.co.uk/sport/football' mobile={4} tablet={2} computer={2} floated='left'>
          <Image src={bbcLogo} />
        </Grid.Column>
        <Grid.Column as='a' target='blank' href='https://motdmag.com/subscribe/' mobile={4} tablet={2} computer={2} floated='right'>
          <Image src={subscribe} />
        </Grid.Column>
      </Grid.Row> */}

      <Grid.Row columns={1} centered>
        <Grid.Column mobile={16} tablet={12} computer={12}>
          <Grid columns={4} className='nav'>
            <Grid.Column as='a' href='https://motdmag.com/' className='nav-item link-image home'>
              <div className='link-text'>Home</div>
            </Grid.Column>
            <Grid.Column as={Link} to='/' className={classnames('nav-item link-image league', { active: pathname === '/' })}>
              <div className='link-text'>League</div>
            </Grid.Column>
            <Grid.Column as={Link} to='/how-to-play' className={classnames('nav-item link-image how-to-play', { active: pathname === '/how-to-play' })}>
              <div className='link-text'>How it Works</div>
            </Grid.Column>
            <Grid.Column as={Link} to='/rules' className={classnames('nav-item link-image rules', { active: pathname === '/rules' })}>
              <div className='link-text'>FAQs</div>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
