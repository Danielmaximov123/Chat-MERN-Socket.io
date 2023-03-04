import { Avatar, Box, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import Logout from '@mui/icons-material/Logout';

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const UserInMenu = ({ user , setEditUser , setChatSelect , socket}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch()
    const {loadingUpdate} = useSelector(state => state.users)

  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
        sx={{ ml: 2 }}
          className='avatar-img'
      >
        {
          loadingUpdate ? <CircularProgress sx={{ color : '#FFFFFF' }} style={{ width: "1.5rem", height: "1.5rem" , margin : '0.5rem'}}/> :
        <Tooltip placement='left' title={user?.displayName}>
        <Avatar
          src={
            user?.profilePicture?.url
            ? user?.profilePicture?.url
            : 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'
          }
          />
        </Tooltip>
        }
      </IconButton>

    </Box>
    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {setEditUser(true) ; setChatSelect(null)}}>
          <Avatar src={
            user?.profilePicture?.url
            ? user?.profilePicture?.url
            : 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'
          }/> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {dispatch({type : 'LOGOUT_AUTH'}); socket.current.disconnect()}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserInMenu
