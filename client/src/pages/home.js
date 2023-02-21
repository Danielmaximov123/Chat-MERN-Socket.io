import { Box, Grid } from '@mui/material'
import style from '../styles'
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getUserChats } from '../redux/action/ChatAction';
import ConversationComp from '../components/Conversation/Conversation';
import ChatBoxComp from '../components/ChatBox/ChatBox';
import { io } from "socket.io-client";

const Home = ({user}) => {
  const dispatch = useDispatch()
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [chatSelect, setChatSelect] = useState(null)
  const [sendMessage, setSendMessage] = useState(null)
  const [receiveMessage, setReceiveMessage] = useState(null)
  const socket = useRef();
  const scroll = useRef()
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    const getChats = async () => {
      let resp = await getUserChats(user.id)
      setChats(resp.data)
    }
    getChats()
  },[user])

  // Socket
  useEffect(() => {
    if(sendMessage !== null) {
      socket.current.emit('send-message' ,sendMessage)
    }
  },[sendMessage])

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_IO)
    socket.current.emit("new-user-add" , user.id)
    socket.current.on('get-users' , users => {
      setOnlineUsers(users)
    })
  },[user])

  useEffect(() => {
    socket.current.on('receive-message' , data => {
      setReceiveMessage(data)
    })
  },[])



  return (
    <Box sx={style.mainBoxInChatPage}>
      <h2 style={{textAlign : 'center'}}>Chat</h2>
      <Box sx={{width : '100%'}} >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {/* left side chat */}
      <Grid item xs={3.5} sx={{backgroundColor: '#FFFFFF', borderRadius: '1rem', marginLeft: '1rem' , paddingLeft: '0.2rem !important'}}>
        {
          chats.map(chat => {
            const checkOnlineStatus = (chats) => {
              const chatMember = chat.members.find( member => member !== user?._id )
            }
          
            return <Box onClick={() => {setCurrentChat(chat); setChatSelect(chat._id)}} key={chat._id}>
              <ConversationComp onlineUsers={onlineUsers} select={chatSelect} data={chat} currentUser={user.id}/>
            </Box>
          })
        }
      </Grid>
      {/* right side chat */}
      <Grid item xs={7.5} sx={{backgroundColor: '#FFFFFF', borderRadius: '1rem', marginLeft: '1rem' , paddingLeft: '0rem !important'}}>
        {
          <Box className="ChatBox-container">
            {
              chatSelect !== null ? 
              <ChatBoxComp chat={currentChat} currentUser={user.id} setSendMessage={setSendMessage} receiveMessage={receiveMessage}/> : 
                <span className='chatbox-empty-message'>Tap on a Chat to start conversation...</span>
            }
          </Box>
        }
      </Grid>
        </Grid>
    </Box>
    </Box>
  )
}

export default Home