import { Box, Grid } from '@mui/material'
import style from '../styles'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { getUserChats } from '../redux/action/ChatAction'
import ConversationComp from '../components/Conversation/Conversation'
import ChatBoxComp from '../components/ChatBox/ChatBox'
import { io } from 'socket.io-client'
import { getAllUsers } from '../redux/action/UserAction'
import User from '../components/users/User'

const Home = ({ user }) => {
  const dispatch = useDispatch()
  const chats = useSelector((state) => state.chats.chats)
  const users = useSelector((state) => state.users.users)
  const [currentChat, setCurrentChat] = useState(null)
  const [chatSelect, setChatSelect] = useState(null)
  const [sendMessage, setSendMessage] = useState(null)
  const [receiveMessage, setReceiveMessage] = useState(null)
  const socket = useRef()
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    dispatch(getUserChats(user.id))
  }, [user, dispatch])

  useEffect(() => {
    dispatch(getAllUsers())
  }, [])

  // Socket
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage)
    }
  }, [sendMessage])

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_IO)
    socket.current.emit('new-user-add', user.id)
    socket.current.on('get-users', (users) => {
      setOnlineUsers(users)
    })
    socket.current.on('receive-chat', (chat) => {
      dispatch({ type : 'ADD_CHAT' , chat })
      dispatch(getUserChats(user.id))
    })
  }, [user])

  useEffect(() => {
    socket.current.on('receive-message', (data) => {
      setReceiveMessage(data)
    })
  }, [])

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user?.id)
    const online = onlineUsers.find((user) => user.userId === chatMember)
    return online ? true : false
  }

  let usersWithoutMe = users.filter((i) => i._id !== user?.id)

  return (
    <Box sx={style.mainBoxInChatPage}>
      <h2 style={{ textAlign: 'center' }}>Chat</h2>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* left side chat */}
          <Grid
            item
            xs={3.5}
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1rem',
              marginLeft: '1rem',
              paddingLeft: '0.2rem !important',
            }}
          >
            {usersWithoutMe.length > 0 && (
              <>
                {usersWithoutMe?.map((member) => {
                  const matchingChat = chats.find((chat) =>
                    chat?.members.includes(member._id),
                  )
                  if (matchingChat) {
                    return (
                      <Box
                        key={matchingChat._id}
                        onClick={() => {
                          setCurrentChat(matchingChat)
                          setChatSelect(matchingChat._id)
                        }}
                      >
                        <ConversationComp
                          select={chatSelect}
                          data={matchingChat}
                          currentUser={user.id}
                          online={checkOnlineStatus(matchingChat)}
                        />
                      </Box>
                    )
                  } else {
                    return (
                      <Box key={member._id}>
                        <User socket={socket} currentUser={user.id} member={member} />
                      </Box>
                    )
                  }
                })}
              </>
            )}
          </Grid>
          {/* right side chat */}
          <Grid
            item
            xs={7.5}
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1rem',
              marginLeft: '1rem',
              paddingLeft: '0rem !important',
            }}
          >
            {
              <Box className="ChatBox-container">
                {chatSelect !== null ? (
                  <ChatBoxComp
                    online={checkOnlineStatus(currentChat)}
                    chat={currentChat}
                    currentUser={user.id}
                    setSendMessage={setSendMessage}
                    receiveMessage={receiveMessage}
                  />
                ) : (
                  <span className="chatbox-empty-message">
                    Tap on a Chat to start conversation...
                  </span>
                )}
              </Box>
            }
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Home
