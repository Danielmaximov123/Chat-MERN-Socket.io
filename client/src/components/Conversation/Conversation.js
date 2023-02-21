import { Avatar, Box, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getUser } from './../../redux/action/UserAction';
import styled from '../../styles'
import { StyledBadge } from './../Custom Style/StyledAvatarDot';

const ConversationComp = ({ data , currentUser , select , onlineUsers }) => {
  const [userData, setUserData] = useState(null)

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

  return (
    <ListItem disablePadding sx={{ display: 'block' }} >
      <ListItemButton selected={select === data._id} sx={{margin: '1rem', borderRadius: '1rem'}}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant={onlineUsers.find(user => user.userId === userData?._id) && 'dot'}
      >
        <Avatar sx={{ width: 56, height: 56 }} alt={userData?.profilePicture} src={userData?.profilePicture ? userData?.profilePicture : "/static/images/avatar/1.jpg"} />
      </StyledBadge>
      <ListItemText primary={<p style={{margin : 0}}>{userData?.username}</p>} secondary={onlineUsers.find(user => user.userId === userData?._id) ? "Online" : "Offline"} sx={{ marginLeft: '8px' }} />
      </ListItemButton>
    </ListItem>
  )
}

export default ConversationComp