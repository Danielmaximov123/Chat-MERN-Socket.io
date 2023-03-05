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
import Push from 'push.js'

const Home = ({ user , auth}) => {
  const dispatch = useDispatch()
  const chats = useSelector((state) => state.chats.chats)
  const {users, loadingUpdate, userLoading} = useSelector((state) => state.users)  
  const [currentChat, setCurrentChat] = useState(null)
  const [chatSelect, setChatSelect] = useState(null)
  const messages = useSelector((state) => state.messages.messages)
  const messagesLoading = useSelector((state) => state.messages.loading)
  const socket = useRef()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [editUser, setEditUser] = useState(false)
  const [usersWithoutMe, setUsersWithoutMe] = useState([])

  const updateUsersWithoutMe = () => {
    setUsersWithoutMe(users?.filter((i) => i?._id !== user?._id))
  }

  useEffect(() => {
    dispatch(getUserChats(user?._id))
  }, [user , dispatch])

  useEffect(() => {
    dispatch(getAllUsers())
    updateUsersWithoutMe()
  }, [dispatch , user])
  
  // Socket
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_IO)
    socket.current.emit('new-user-add', auth?.id)
    socket.current.on('get-users', (users) => {
      setOnlineUsers(users)
    })
    socket.current.on('receive-chat', (chat) => {
      dispatch({ type : 'ADD_CHAT' , chat })
      dispatch(getUserChats(user._id))
    })
  }, [auth])

  useEffect(() => {
    socket.current.on('receive-message', data => {
      dispatch({ type : 'ADD_MESSAGE' , payload : data.data })
      Push.create(data.findUser.displayName, {
        body: data.data.text,
        icon: data.findUser.profilePicture.url,
        timeout: 4000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    })
  }, [])

useEffect(() => {
  socket.current.on('user-updated', async (updatedUserDetails) => {
    await dispatch({ type: 'UPDATE_USER', payload: updatedUserDetails });
    updateUsersWithoutMe()
  });
}, []);


  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user?._id)
    const online = onlineUsers.find((user) => user.userId === chatMember)
    return online ? true : false
  }

  return (
      <Box sx={style.mainBoxInChatPage}>
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
              <Box sx={{width: '45%', float: 'left'}}><h2 style={{ margin: 'auto 2rem' , color : '#15c41e'}}>Chat</h2></Box>
              <Box sx={{ float: 'right' , display: 'inline-flex' , margin: '0 2rem'}}>
                <UserInMenu socket={socket} setChatSelect={setChatSelect} userId={user?._id} setEditUser={setEditUser}/>
              </Box>
              </Box>
              <Box>
                {usersWithoutMe?.length > 0 && (
                <>
                {/* here its not update */}
                  {usersWithoutMe?.map((member) => {
                    const matchingChat = chats.find((chat) =>
                    chat?.members.includes(member?._id)
                  )
                  
                    if (matchingChat) {
                      return (
                        <Box
                          key={matchingChat._id}
                          onClick={() => {
                            setCurrentChat(matchingChat)
                            setChatSelect(matchingChat._id)
                            setEditUser(false)
                          }}
                        >
                          <ConversationComp
                            select={chatSelect}
                            data={matchingChat}
                            currentUser={user?._id}
                            online={checkOnlineStatus(matchingChat)}
                          />
                        </Box>
                      )
                    } else {
                      return (
                        <Box key={member?._id}>
                          <User socket={socket} currentUser={user?._id} member={member} />
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
                  <Box className="ChatBox-container">
                {
                    editUser ? <EditUser socket={socket} /> :
                    <>
                      {chatSelect !== null ? 
                    <ChatBoxComp
                      online={checkOnlineStatus(currentChat)}
                      chat={currentChat}
                      currentUser={user?._id}
                      messages={messages}
                      loading={messagesLoading}
                      socket={socket}
                    />
                   : 
                    <span className="chatbox-empty-message">
                      Tap on a Chat to start conversation...
                    </span>
                    }
                    </>
                  }
                    </Box>
              
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }

export default Home
