import { Avatar, Box, CircularProgress, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getUser } from './../../redux/action/UserAction';
import { StyledBadge } from './../Custom Style/StyledAvatarDot';

const ConversationComp = ({ data , currentUser , select , online , userLoading }) => {
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

  if(userLoading) {
    return(
      <CircularProgress sx={{ color : '#FFFFFF' }} style={{ width: "1.5rem", height: "1.5rem" , margin : '0.5rem'}}/>
    )
  }

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
      <ListItemText primary={<p style={{margin : 0}}>{userData?.displayName}</p>} secondary={online ? "Online" : "Offline"} sx={{ marginLeft: '8px' }} />
      </ListItemButton>
    </ListItem>
    </>
  )
}

export default ConversationComp