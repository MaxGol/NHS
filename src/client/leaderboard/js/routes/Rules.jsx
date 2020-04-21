import React from 'react'
import { Grid, Header, List, Image } from 'semantic-ui-react'
import footballerOne from 'common/images/football_1.png'
import footballerTwo from 'common/images/football_2.png'
import footballerThree from 'common/images/football_3.png'
import footballerFour from 'common/images/football_4.png'

export const Rules = () => {
  return (
    <Grid className='padding-top-20 padding-bottom-20' columns={1} centered>
      <Grid.Column mobile={15} tablet={12} computer={12}>

        <div className='page-title-header green margin-bottom-20'>
          <Header as='h3'>HOW <span className='thiner'>DO I PLAY IT?</span></Header>
        </div>

        <List as='ol' className='how-to-play-list'>
          <List.Item as='li'>To open the game, simply say <strong>"Alexa, enable Match of the Day magazine"</strong> or <strong>"Hey Google, talk to Match of the Day magazine!"</strong></List.Item>
          <List.Item as='li'>Choose your level and pick your club (any Prem, EFL, Scottish Premiership or National League club!)</List.Item>
          <List.Item as='li'>Answer the questions correctly to score points for your team!</List.Item>
        </List>

        <p>
        Remember, there’s a new quiz every Tuesday (the same day a new issue of BBC Match of the Day magazine hits the shelves!) and you can play at any time during the week. There’s also a Training Mode if you get through the weekly quiz super-fast!
        </p>

        <div className='page-title-header green margin-bottom-20'>
          <Header as='h3'><span className='thiner'>CAN I PLAY</span> MORE OFTEN?</Header>
        </div>

        <p>
        Yes, you can! Once you’ve completed the weekly quiz, you can come back and play in Training Mode. You won’t be able to score points for your team, but you can test yourself and keep your footy trivia skills in elite condition.
        </p>

        <Grid stackable className='margin-bottom-20'>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Image wrapped className='insert-images red' src={footballerOne} />
            </Grid.Column>
            <Grid.Column>
              <Image wrapped className='insert-images red' src={footballerTwo} />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className='page-title-header green margin-bottom-20'>
          <Header as='h3'><span className='thiner'>HOW ARE THE</span> POINTS CALCULATED?</Header>
        </div>

        <p>
        In the Sunday league, you earn 0.5 points for every question you answer correctly, while in the harder, Pro league, you get 1 point for the correct answer. A club’s total is the average points scored by their fans in the weekly quiz!
        </p>

        <div className='page-title-header green margin-bottom-20'>
          <Header as='h3'><span className='thiner'>WHAT CAN I SEE ON THE</span> LEADERBOARD?</Header>
        </div>

        <p>
        The leaderboard shows the overall scores in the season, which runs from June to May. You can also see results from the most recent week which always runs from Tuesday to Monday.
        </p>

        <div className='page-title-header green margin-bottom-20'>
          <Header as='h3'><span className='thiner'>CAN I</span> CHANGE MY CLUB?</Header>
        </div>

        <p>
        Sure. You can choose your club via voice before you start the quiz every week!
        </p>

        <Grid stackable className='margin-bottom-20'>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Image wrapped className='insert-images pink' src={footballerThree} />
            </Grid.Column>
            <Grid.Column>
              <Image wrapped className='insert-images pink' src={footballerFour} />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className='page-title-header green margin-bottom-20'>
          <Header as='h3'>I DON’T HAVE A SMART-SPEAKER, <span className='thiner'>BUT I STILL WANT TO PLAY…</span></Header>
        </div>

        <p>
        No problem. If you don’t have an Alexa or Google Home at home, you can always play using Google Assistant on a smartphone. Google Assistant comes as standard on all Android Devices. But you can always download the app via the AppStore or GooglePlay.
        </p>

        <div className='page-title-header green margin-bottom-20'>
          <Header as='h3'>I’M HARD OF HEARING, <span className='thiner'>BUT I STILL WANT TO PLAY…</span></Header>
        </div>

        <p>
        If you have a smartphone, you can download Google Assistant via the App Store or GooglePlay. Simply follow the steps and instead of speaking to your device, click the keyboard icon in the bottom, left-hand corner. You can then type “Hey Google, talk to Match of the Day magazine” to get started!
        </p>
      </Grid.Column>
    </Grid>
  )
}
