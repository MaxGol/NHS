import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { Routes } from './Routes'
import Cookies from 'js-cookie'

const cache = new InMemoryCache({ addTypename: false })

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_ENDPOINT
})

const authLink = setContext((_, { headers }) => {
  const accessToken = Cookies.get('accessToken')
  return {
    headers: {
      ...headers,
      Authorization: accessToken || ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers: {}
})

cache.writeData({
  data: {
    isLoggedIn: !!Cookies.get('accessToken'),
    weekDate: ''
  }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
