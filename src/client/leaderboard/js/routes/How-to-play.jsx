import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Header, Image, List } from 'semantic-ui-react'
import googleStaticImg from 'common/images/google_static_img.png'
import alexaStaticImg from 'common/images/amazon_static_img.png'

export const HowToPlay = () => {
  return (
    <Grid className='padding-top-20 padding-bottom-20' columns={1} centered>
      <Grid.Column mobile={15} tablet={12} computer={12}>
        <div className='page-title-header red margin-bottom-20'>
          <Header as='h3'>THE ULTIMATE VOICE TRIVIA GAME <span className='thiner'>FOR FOOTY FANS!</span></Header>
        </div>
        <p>
        The BBC Match of the Day magazine Quiz is the ultimate trivia game for football fans, created by BBC Match of the Day magazine! You access it through Amazon Alexa or Google Assistant on any voice-enabled devices. The quiz consists of five questions - with a new set released every Tuesday (the same day the magazine hits the shelves!) You can play the game at two levels: in the easier Sunday League or in the more challenging Pro League. With every correct answer, you score points for your favourite club. Check the <Link to='/'>leaderboard</Link> to see how your team is doing!
        </p>
        <div className='page-title-header red margin-bottom-20'>
          <Header as='h3'>HOW <span className='thiner'>IT WORKS</span></Header>
        </div>
        <Grid stackable className='margin-bottom-20'>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Image src={googleStaticImg} />
            </Grid.Column>
            <Grid.Column>
              <Image src={alexaStaticImg} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <List as='ol' className='how-to-play-list'>
          <List.Item as='li'>You can score points for your team <strong>once a week!</strong></List.Item>
          <List.Item as='li'>You can play <strong>unlimited</strong> rounds in ‘Training Mode’. This is structured the same as in the weekly competition, so  a great opportunity to practice until a fresh quiz is released on Tuesday!</List.Item>
          <List.Item as='li'>Play on a <strong>smart-speaker</strong> or on a <strong>mobile phone</strong> using Amazon Alexa or Google Assistant!</List.Item>
          <List.Item as='li'>If you play on a smart-speaker, just say <i>"Alexa, enable Match of the Day magazine"</i> or <i>"Hey Google, talk to Match of the Day magazine!"</i></List.Item>
          <List.Item as='li'>Select your <strong>level</strong> (Sunday League for easier questions or Pro League for a more challenging game)!</List.Item>
          <List.Item as='li'>Choose a <strong>Premier League, EFL, Scottish Premiership or National League</strong> club to represent and score points for!</List.Item>
          <List.Item as='li'>Answer all <strong>five questions</strong> and put your footie trivia knowledge to the test!</List.Item>
          <List.Item as='li'>Check the <strong>leaderboard</strong> to find out how your club is doing!</List.Item>
          <List.Item as='li'><strong>Keep practising</strong> between the weekly quizzes, play one player or challenge your friends!</List.Item>
        </List>
      </Grid.Column>
    </Grid>
  )
}
