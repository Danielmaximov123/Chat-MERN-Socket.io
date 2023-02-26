import { Avatar, Box, Divider, Grid, ListItemText } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import { getUser } from '../../redux/action/UserAction'
import { StyledBadge } from '../Custom Style/StyledAvatarDot'
import { getMessages } from './../../redux/action/MessagesAction'
import ChatSenderComp from './ChatSender'
import { format } from 'timeago.js'

const ChatBoxComp = ({
  chat,
  currentUser,
  setSendMessage,
  receiveMessage,
  online,
  messages,
  setMessages
}) => {
  const [userData, setUserData] = useState(null)
  const scroll = useRef()

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage?.chatId === chat?._id) {
      setMessages([...messages, receiveMessage])
    }
  }, [receiveMessage])

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
  }, [chat, currentUser])

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let resp = await getMessages(chat?._id)
        setMessages(resp)
      } catch (error) {
        console.error(error)
      }
    }
    chat !== null && fetchMessages()
  })

  // Always scroll to last Message
  // useEffect(()=> {
  // },[messages])

  useEffect(() => {
    if (scroll.current) {
      scroll.current?.scrollIntoView()
    }
    // scrollDown(scroll.current?.scrollIntoView({ behavior : 'auto' }))
  }, [scroll.current])

  return (
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
              alt={userData?.profilePicture}
              src={
                userData?.profilePicture
                  ? userData.profilePicture
                  : '/static/images/avatar/1.jpg'
              }
            />
          </StyledBadge>
          <ListItemText
            primary={<p style={{ margin: 0 }}>{userData?.username}</p>}
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
                      message.senderId === currentUser
                        ? 'flex-end'
                        : 'flex-start',
                    display: 'inline-grid',
                    border:
                      message.senderId === currentUser
                        ? '1px #07ae12ce solid'
                        : '1px #696969ab solid',
                    color:
                      message.senderId === currentUser
                        ? '#07ae12ce'
                        : '#696969ab',
                    borderRadius: '1rem 1rem 0rem 1rem',
                    gap: '0.5rem',
                  }}
                  // className={
                  //   message?.senderId === currentUser ? 'message own' : 'message'
                  // }
                >
                  <span>{message.text}</span>
                  <span style={{ fontSize: '0.7rem', alignSelf: 'end' }}>
                    {format(message.createdAt)}
                  </span>
                </Box>
              )
            })}
          </>
        )}
      </Box>
      {/* Chat Sender */}
          <ChatSenderComp
            setSendMessage={setSendMessage}
            setMessages={setMessages}
            chat={chat}
            currentUser={currentUser}
          />
    </>
  )
}

export default ChatBoxComp
