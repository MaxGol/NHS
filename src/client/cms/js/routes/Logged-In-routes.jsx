import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { Entry } from './Entry'

export const LoggedInRoutes = withRouter(() => {
  return (
    <div>
      <Route exact path='/' component={Entry} />
    </div>
  )
})
