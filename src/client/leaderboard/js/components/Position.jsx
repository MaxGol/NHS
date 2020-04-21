import React from 'react'
import { Icon } from 'semantic-ui-react'

export const Position = ({ team }) => {
  const positionLastWeek = team.positionLastWeek ? team.positionLastWeek : 0
  const positionPreviousWeek = team.positionPreviousWeek ? team.positionPreviousWeek : 0
  if (positionLastWeek > positionPreviousWeek) {
    return <Icon name='caret up' color='green' />
  } else if (positionLastWeek < positionPreviousWeek) {
    return <Icon name='caret down' color='red' />
  } else {
    return <Icon name='exchange' color='blue' />
  }
}
