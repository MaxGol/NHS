import React, { useState } from 'react'
import { Grid, Container, Button, Form, Message, Icon } from 'semantic-ui-react'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { LOGIN } from 'schema/mutation'
import Cookies from 'js-cookie'
import { validate } from 'email-validator'

export const Login = ({ history }) => {
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [authenticate] = useMutation(LOGIN)
  const client = useApolloClient()

  const submit = async (e) => {
    console.log()
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data: { login: { accessToken } } } = await authenticate({ variables: { email, password } })
      if (accessToken) {
        Cookies.set('accessToken', accessToken, { expires: (1 / 24) })
        client.writeData({ data: { isLoggedIn: true } })
        history.push('/')
      }
    } catch (error) {
      console.log(error)
      setError(error.message.split(':')[1])
      setSubmitting(false)
    }
  }

  const handleEmailChange = (email) => {
    setEmail(email)
    validate(email) ? setEmailValid(true) : setEmailValid(false)
  }

  return (
    <div className='login'>
      <Container className='login-container'>
        <Grid centered stretched verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column mobile={12} tablet={10} computer={8}>
              <Form className='login-form-wrapper' loading={submitting} onSubmit={submit}>
                <Form.Input
                  error={!!email && !emailValid}
                  icon={email && !emailValid ? <Icon color='red' name='close' /> : email && emailValid ? <Icon color='green' name='check' /> : null}
                  label='Email'
                  placeholder='Email'
                  value={email}
                  onChange={(e, { value }) => handleEmailChange(value)}
                />
                <Form.Input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e, { value }) => setPassword(value)}
                />
                <Button primary fluid type='submit' disabled={!password.length || !emailValid}>LOGIN</Button>
              </Form>
              {error &&
                <Message negative style={{ marginTop: '2em' }}>
                  <Message.Header>Login Error</Message.Header>
                  <p>{error}</p>
                </Message>}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  )
}
