import { Avatar, Box, CircularProgress, Divider, Grid, ListItemText } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import { getUser } from '../../redux/action/UserAction'
import { StyledBadge } from '../Custom Style/StyledAvatarDot'
import { getMessages } from './../../redux/action/MessagesAction'
import ChatSenderComp from './ChatSender'
import { format } from 'timeago.js'
import { useDispatch } from 'react-redux'

const ChatBoxComp = ({
  chat,
  currentUser,
  online,
  messages,
  setMessages,
  loading,
  socket
}) => {
  const [userData, setUserData] = useState(null)
  const scroll = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    const userId = chat?.members?.find((id) => !id.includes(currentUser))
    const getUserData = async () => {
      try {
        let resp = await getUser(userId)
        setUserData(resp)
      } catch (error) {
        console.error(error)
      }
    }
    chat !== null && getUserData()
  }, [chat, currentUser , dispatch])

  // fetch messages
  useEffect(() => {
    chat !== null && dispatch(getMessages(chat?._id))
  },[dispatch , chat])


  useEffect(() => {
    if (scroll.current) {
      scroll.current?.scrollIntoView({ behavior : 'smooth' })
    }
  }, [messages])

  return (
    <>
    {
      loading ? <Box sx={{margin : 'auto'}}><CircularProgress sx={{height : '4rem' , width : '4rem'}} color="success" /></Box> :
      <>
            {/* Chat Header */}
            <Box>
        <Box display="inline-flex" sx={{ margin: '1rem' }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant={online ? 'dot' : 'standard'}
          >
            <Avatar
              sx={{ width: 56, height: 56 }}
              alt={userData?.profilePicture?.url}
              src={
                userData?.profilePicture?.url
                  ? userData.profilePicture?.url
                  : 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'
              }
            />
          </StyledBadge>
          <ListItemText
            primary={<p style={{ margin: 0 }}>{userData?.displayName}</p>}
            secondary={online ? 'Online' : 'Offline'}
            sx={{ marginLeft: '8px' }}
          />
        </Box>
        <Divider sx={{ marginLeft: '0' }} variant="inset" />
      </Box>
      {/* Chat Box Messages */}
      <Box className="chat-body">
        {messages.length > 0 && (
          <>
            {messages?.map((message, index) => {
              return (
                <Box
                  key={index}
                  ref={scroll}
                  sx={{
                    padding: '1rem',
                    alignSelf:
                      message?.senderId === currentUser
                        ? 'flex-end'
                        : 'flex-start',
                    display: 'inline-grid',
                    border:
                      message?.senderId === currentUser
                        ? '1px #07ae12ce solid'
                        : '1px #696969ab solid',
                    color:
                      message?.senderId === currentUser
                        ? '#07ae12ce'
                        : '#696969ab',
                    borderRadius: '1rem 1rem 0rem 1rem',
                    gap: '0.5rem',
                  }}
                >
                  <span>{message?.text}</span>
                  <span style={{ fontSize: '0.7rem', alignSelf: 'end' }}>
                    {format(message?.createdAt)}
                  </span>
                </Box>
              )
            })}
          </>
        )}
      </Box>
      {/* Chat Sender */}
          <ChatSenderComp
            setMessages={setMessages}
            chat={chat}
            currentUser={currentUser}
            socket={socket}
          />
      </>
    }
    </>
  )
}

export default ChatBoxComp
