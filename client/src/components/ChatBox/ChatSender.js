import { Box, Button, Chip, IconButton } from '@mui/material'
import { useState } from 'react'
import InputEmoji from 'react-input-emoji'
import AddBoxIcon from '@mui/icons-material/AddBox'
import SendIcon from '@mui/icons-material/Send'
import { postMessages } from '../../redux/action/MessagesAction'

const ChatSenderComp = ({currentUser , chat , setMessages , setSendMessage}) => {
  const [newMessage, setNewMessage] = useState('')

  const handleChange = (e) => {
    setNewMessage(e)
  }

  const handleSubmit = async  (e) => {
    e.preventDefault()
    const message = {
        senderId : currentUser,
        text : newMessage,
        chatId : chat._id
    }

    // send message to DB 
    try {
        let data = await postMessages(message)
        setMessages([...'messages', data])
        setNewMessage('')
    } catch (error) {
        console.error(error)
    }
    // send message to RT
    const receiverId = chat.members.find(id => id !== currentUser)
    setSendMessage({..."message", receiverId})
  }

  return (
      <Box component='form' onSubmit={handleSubmit}>
    <Box display="flex" sx={{ padding: '0.5rem 0rem', display: 'flex' }}>
      <IconButton sx={{ marginLeft: '0.5rem' }}>
        <AddBoxIcon />
      </IconButton>
      <InputEmoji value={newMessage} onChange={handleChange} />
      <Chip
        component='button'
        type='submit'
        clickable
        sx={{
          margin: 'auto 0.5rem',
          padding: '1.2rem 0.5rem',
          color: '#07ae12ce',
          borderColor : '#07ae12ce',
          direction: 'rtl'
        }}
        label={<p style={{letterSpacing: '3px', fontSize: '0.850rem', fontWeight: '500'}}>Send</p>}
        variant="outlined"
        icon={<SendIcon color='#07ae12ce'/>}
      />
      </Box>
    </Box>
  )
}

export default ChatSenderComp
