import React from 'react'
import { Image, Grid, Responsive } from 'semantic-ui-react'
import voxlyLogo from 'common/images/voxly_digital_logo.png'
import bbcWhiteLogo from 'common/images/bbc_white.png'
import ipsoLogo from 'common/images/ipso_logo.png'
import immediateLogo from 'common/images/immediate_logo.png'

export const Footer = () => {
  return (
    <div className='footer'>
      <Responsive maxWidth={767}>
        <p className='disclaimer margin-bottom-10'>
            This website is published by
          <a href='http://www.immediate.co.uk'>Immediate Media Company Limited</a>
            under licence from BBC Studios Distribution Limited.
        </p>
      </Responsive>
      <Responsive minWidth={768}>
        <p className='margin-bottom-10'>
            This website is published by <a href='http://www.immediate.co.uk'>Immediate Media Company Limited</a> under licence from BBC Studios Distribution Limited.
        </p>
      </Responsive>
      <ul>
        <li><a href='https://policies.immediate.co.uk/privacy/' target='blank'>Privacy Policy</a></li>
        <li><a href='https://policies.immediate.co.uk/cookies-policy/' target='blank'>Cookies Policy</a></li>
        <li><a href='http://www.immediate.co.uk/terms-and-conditions/' target='blank'>Terms &amp; Conditions</a></li>
        <li><a href='http://www.immediate.co.uk/complaints-escalation/' target='blank'>Complaints</a></li>
        <li><a href='http://www.immediate.co.uk/brands/match-of-the-day/' target='blank'>Advertise With Us</a></li>
        <li><a href='http://www.immediate.co.uk/contact-us/' target='blank'>Contact Us</a></li>
      </ul>
      <Grid columns={1} centered className='margin-top-10'>
        <Grid.Column mobile={16} tablet={14} computer={12} className='padding-top-0'>
          <Grid className='margin-top-10' centered>
            <Grid.Row className='padding-top-0'>
              <Grid.Column mobile={8} tablet={4} computer={4} verticalAlign='middle' className='padding-top-10 padding-bottom-10'>
                <Image size='small' centered src={bbcWhiteLogo} alt='BBC Logo' />
              </Grid.Column>
              <Grid.Column mobile={8} tablet={4} computer={4} verticalAlign='middle' className='padding-top-10 padding-bottom-10'>
                <Image size='small' centered src={immediateLogo} alt='Immediate Logo' />
              </Grid.Column>
              <Grid.Column mobile={8} tablet={4} computer={4} verticalAlign='middle' className='padding-top-10 padding-bottom-10'>
                <Image centered src={ipsoLogo} alt='IPSO Logo' />
              </Grid.Column>
              <Grid.Column mobile={8} tablet={4} computer={4} verticalAlign='middle' className='padding-top-10 padding-bottom-10'>
                <Image as='a' href='https://www.voxlydigital.com/' target='blank' centered src={voxlyLogo} alt='Voxly Digital Logo' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid>
      <p className='margin-top-10'>© Immediate Media Company Limited, 2020</p>
    </div>
  )
}
