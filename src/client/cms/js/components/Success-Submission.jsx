import React, { useState } from 'react'
import { Modal, Header, Icon, Button } from 'semantic-ui-react'

export const SuccessSubmission = () => {
  const [open, setOpen] = useState(true)
  const handleClick = () => {
    setOpen(false)
  }

  return (
    <Modal size='tiny' open={open}>
      <Header>
        <Icon name='thumbs up' color='green' />
        <Header.Content>Success</Header.Content>
      </Header>
      <Modal.Content>
        <p>
          Questions have been successful.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => handleClick()} color='green'>
          <Icon name='checkmark' /> OK
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
