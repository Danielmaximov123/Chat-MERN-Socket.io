import { Box, Chip, Grid, IconButton } from '@mui/material'
import {  useState } from 'react'
import InputEmoji from 'react-input-emoji'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send'
import { postMessages } from '../../redux/action/MessagesAction'

const ChatSenderComp = ({currentUser , chat , setMessages , setSendMessage}) => {
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState(null)

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

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }
  

  return (
    <Grid container spacing={3}>
      <Grid xs={12} sx={{ margin: 'auto' }}>
          {file && (
            <Box sx={{ margin: 'auto', textAlign: 'center' }}>
              <span>
                {file.name}{' '}
                <span
                  style={{
                    fontSize: '1.2rem',
                    verticalAlign: 'middle',
                    color: 'red',
                    cursor: 'pointer',
                  }}
                  onClick={() => setFile(null)}
                >
                  X
                </span>
              </span>
            </Box>
          )}
        </Grid>
        <Grid xs={12} sx={{ padding: '0rem 2rem' }}>
    <Box>
    <Box component='form' onSubmit={handleSubmit}>
  <Box display="flex" sx={{ padding: '0rem 0rem', display: 'flex' }}>
  <IconButton component="label" sx={{ marginLeft: '0.5rem' }}>
<input hidden type="file" onChange={handleFile} accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.mp4" />
<AttachFileIcon />
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
    </Box>
      </Grid>
    </Grid>
  )
}

export default ChatSenderComp
