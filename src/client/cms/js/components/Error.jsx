import React, { useState } from 'react'
import { Modal, Header, Icon, Button } from 'semantic-ui-react'
import Cookies from 'js-cookie'

export const Error = () => {
  const [open, setOpen] = useState(true)
  const handleClick = () => {
    setOpen(false)
    Cookies.remove('accessToken')
    window.location = '/login'
  }

  return (
    <Modal size='tiny' open={open}>
      <Header>
        <Icon name='warning sign' color='red' />
        <Header.Content>Error</Header.Content>
      </Header>
      <Modal.Content>
        <p>
          There has been an Error. Please Login and try again.
          If error persists, contact administator.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => handleClick()} color='green'>
          <Icon name='checkmark' /> Login
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
