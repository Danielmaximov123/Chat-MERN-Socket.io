import { Avatar, Badge, Box, CircularProgress, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react'
import { getMessagesForConversation } from '../../redux/action/MessagesAction';
import { getUser } from './../../redux/action/UserAction';
import { StyledBadge } from './../Custom Style/StyledAvatarDot';

const ConversationComp = ({ data , currentUser , select , online , notifications , socket}) => {
  const [userData, setUserData] = useState(null)
  const [ lastMessage , setLastMessage ] = useState(null)
  let notificationFind = notifications.filter(sender => sender?.senderId?.includes(data.members.find(id => !id.includes(currentUser))))

  useEffect(() => {
    const userId = data.members.find(id => !id.includes(currentUser))

    const getUserData = async () => {
      try {
        let data = await getUser(userId)
        setUserData(data)
      } catch (error) {
        console.error(error)
      }
    } 
    getUserData()
  },[])

  useEffect(() => {
      getMessagesForConversation(data._id).then(resp => {
        setLastMessage(...resp.slice(-1))
      })
  },[notifications])

  return (
    <>
    <ListItem disablePadding sx={{ display: 'block' }} >
      <ListItemButton selected={select === data._id} sx={{margin: '1rem', borderRadius: '1rem'}}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant={online ? 'dot' : 'standard'}
      >
        <Avatar sx={{ width: 56, height: 56 }} alt={userData?.profilePicture?.url} src={userData?.profilePicture?.url ? userData?.profilePicture?.url : "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"} />
      </StyledBadge>
      <ListItemText primary={<p style={{margin : 0}}>{userData?.displayName}</p>} secondary={lastMessage?.text.length > 20 ? `${lastMessage?.text?.slice(0 , 20)}...` : lastMessage?.text } sx={{ marginLeft: '8px' }} />
      <p></p>
      {
        !notificationFind.find(chat => chat.chatId === select) &&  notificationFind.length > 0 ?
        <Badge badgeContent={notificationFind.length} color="primary" sx={{marginRight: '2rem'}}/> : null
      }
      </ListItemButton>
    </ListItem>
    </>
  )
}

export default ConversationComp