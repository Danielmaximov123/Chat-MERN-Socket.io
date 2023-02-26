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
import UserInMenu from '../components/User/User In Menu'
import EditUser from '../components/User/Edit User'

const Home = ({ user }) => {
  const dispatch = useDispatch()
  const chats = useSelector((state) => state.chats.chats)
  const users = useSelector((state) => state.users.users)
  const [currentChat, setCurrentChat] = useState(null)
  const [chatSelect, setChatSelect] = useState(null)
  const [sendMessage, setSendMessage] = useState(null)
  const [receiveMessage, setReceiveMessage] = useState(null)
  const [messages, setMessages] = useState([])
  const socket = useRef()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [editUser, setEditUser] = useState(false)

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
      <Box></Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{margin : 'auto !important'}}>
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
            <Box sx={{width : '100%' , display: 'flow-root' , padding: '1rem 0' , borderBottom : '2px dashed #009e0736' }}>
            <Box sx={{width: '50%', float: 'left'}}><h2 style={{ margin: 'auto 2rem' , color : '#15c41e'}}>Chat</h2></Box>
            <Box sx={{ float: 'right' , display: 'inline-flex' , margin: '0 2rem'}}>
              <UserInMenu user={user} editUser={editUser} setEditUser={setEditUser}/>
            
            </Box>
            </Box>
            <Box>
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
            </Box>
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
            <Box>
              {
                editUser ? <EditUser user={user}/> :
                <Box className="ChatBox-container">
                {chatSelect !== null ? (
                  <ChatBoxComp
                    online={checkOnlineStatus(currentChat)}
                    chat={currentChat}
                    currentUser={user.id}
                    setSendMessage={setSendMessage}
                    receiveMessage={receiveMessage}
                    setMessages={setMessages}
                    messages={messages}
                  />
                ) : (
                  <span className="chatbox-empty-message">
                    Tap on a Chat to start conversation...
                  </span>
                )}
              </Box>
              }
            
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Home
