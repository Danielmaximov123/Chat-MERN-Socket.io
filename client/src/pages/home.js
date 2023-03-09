import { Box, Grid } from '@mui/material'
import style from '../styles'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { getChatById, getUserChats } from '../redux/action/ChatAction'
import ConversationComp from '../components/Conversation/Conversation'
import ChatBoxComp from '../components/ChatBox/ChatBox'
import { io } from 'socket.io-client';
import { getAllUsers } from '../redux/action/UserAction'
import User from '../components/users/User'
import UserInMenu from '../components/User/User In Menu'
import EditUser from '../components/User/Edit User'
import { push } from '../push'
import { removeNotification } from '../redux/action/NotificationsAction'

const socket = io.connect(process.env.REACT_APP_URL_SOCKET);

const Home = ({ user}) => {
  const dispatch = useDispatch()
  const { chats, users , auth , notifications } = useSelector((state) => ({
    chats: state.chats.chats,
    users: state.users.users,
    auth : state.auth.auth,
    notifications : state.notifications.notifications
  }))
  const [currentChat, setCurrentChat] = useState(null)
  const [chatSelect, setChatSelect] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [editUser, setEditUser] = useState(false)
  const [usersWithoutMe, setUsersWithoutMe] = useState([])

  const updateUsersWithoutMe = useCallback(() => {
    setUsersWithoutMe(users?.filter((i) => i?._id !== user?._id));
  }, [users, user]);

  const findChatAndUse = async (chatId) => {
    let resp = await getChatById(chatId)
    setCurrentChat(resp)
    setChatSelect(resp._id)
    dispatch(removeNotification({chatId: chatId}))
  };

  // Fetch users and chats only once when the component mounts
  useEffect(() => {
    dispatch(getAllUsers())
    dispatch(getUserChats(user?._id))
  }, [dispatch, user])
  
  useEffect(() => {
    updateUsersWithoutMe();
  }, [user, users]);


  useEffect(() => {
    if(chatSelect !== null) {
      let findChat = chats.find(c => c?._id === chatSelect)
      localStorage.setItem('currentChat' , JSON.stringify(findChat))
      localStorage.setItem('chatSelect' , findChat?._id)
      setEditUser(false)
    }
  },[chatSelect])


  // Socket
  useEffect(() => {
    socket.emit('new-user-add', auth?.id)
    socket.on('get-users', handleGetUsers)
    socket.on('receive-chat', handleReceiveChat)
    socket.on('receive-message', receiveMessage)
    socket.on('user-updated', handleUserUpdated);
    socket.on('notification' , handleNotification)
    
    return () => {
      socket.off('get-users', handleGetUsers)
      socket.off('receive-chat', handleReceiveChat)
      socket.off('receive-message', receiveMessage)
      socket.off('user-updated', handleUserUpdated)
      socket.off('notification' , handleNotification)
  }
  }, [auth]) 

    // Update the list of users who are currently online
  const handleGetUsers = useCallback((users) => {
    setOnlineUsers(users);
  }, []);

    // Receive a new chat from the server
    const handleReceiveChat = useCallback(
      (chat) => {
        dispatch({ type: 'ADD_CHAT', payload : chat });
        dispatch(getUserChats(user._id));
      },
      [dispatch, user]
    );

    // Receive a new message from the server
    const receiveMessage = useCallback((data) => {
      dispatch({ type : 'ADD_MESSAGE' , payload : data.data })
      if(!localStorage.getItem('currentChat')) {
         // Show a desktop notification if the chat is not open.
        push({
          title : data.findUser.displayName,
          body: data.data.text,
          icon: data.findUser.profilePicture.url,
          onClick: () => findChatAndUse(data.data.chatId),
        })
      }
    }, [dispatch]);

    // Handle an update to a user's details
  const handleUserUpdated = useCallback(
    async (updatedUserDetails) => {
      await dispatch({ type: 'UPDATE_USER', payload: updatedUserDetails });
      updateUsersWithoutMe()
    },
    [dispatch, updateUsersWithoutMe]
  );
  
  const handleNotification = useCallback(
    async (notification) => {
      if(localStorage.getItem('chatSelect') !== notification.chatId) {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      }
    },
    []
  );
  
  const checkOnlineStatus = useCallback((chat) => {
    const chatMember = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false
}, [onlineUsers, user]);

    const clickConversation = (matchingChat) => {
      setCurrentChat(matchingChat)
      setChatSelect(matchingChat._id)
      setEditUser(false)
      if(notifications.find(f => f.chatId === matchingChat._id)) {
        dispatch(removeNotification({chatId: matchingChat._id}))
      }
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
                <UserInMenu socket={socket} setCurrentChat={setCurrentChat} setChatSelect={setChatSelect} userId={user?._id} setEditUser={setEditUser}/>
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
                          onClick={() => clickConversation(matchingChat)}
                        >
                          <ConversationComp
                            select={chatSelect}
                            data={matchingChat}
                            currentUser={user?._id}
                            online={checkOnlineStatus(matchingChat)}
                            notifications={notifications}
                            socket={socket}
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
              xs={7}
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
