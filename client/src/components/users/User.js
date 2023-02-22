import { Avatar, Box, IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material'
import React from 'react'
import { createChat } from '../../redux/action/ChatAction';
import { StyledBadge } from './../Custom Style/StyledAvatarDot';
import { useDispatch } from 'react-redux';

const User = ({member , currentUser , socket }) => {
    const dispatch = useDispatch()

    const handleFriendReq = async () => {
        // send to DB 
        let data = { senderId : currentUser,receiverId : member._id}
        dispatch(createChat(data , socket))

    }

    
  return (
        <ListItem disablePadding sx={{ display: 'block' }} secondaryAction={
            <Tooltip placement='right' title="Start Chat">
            <IconButton onClick={handleFriendReq} edge="end" >+</IconButton>
            </Tooltip>
        }>
    <ListItemButton disabled sx={{margin: '1rem', borderRadius: '1rem'}}>
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Avatar sx={{ width: 56, height: 56 }} alt={member?.profilePicture} src={member?.profilePicture ? member?.profilePicture : "/static/images/avatar/1.jpg"} />
    </StyledBadge>
    <ListItemText primary={<p style={{margin : 0}}>{member?.username}</p>} secondary='you are not friends' sx={{ marginLeft: '8px' }} />
    </ListItemButton>
  </ListItem>
  )
}

export default User