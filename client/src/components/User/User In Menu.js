import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import Logout from '@mui/icons-material/Logout';

import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

const UserInMenu = ({ user , setEditUser }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch()

  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
        sx={{ ml: 2 }}
      >
        <Tooltip placement='left' title={user?.username}>
        <Avatar
          src={
            user?.profilePicture
              ? user?.profilePicture
              : '/static/images/avatar/1.jpg'
          }
        />
        </Tooltip>
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
        <MenuItem onClick={() => {setEditUser(true)}}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {dispatch({type : 'LOGOUT_AUTH'})}}>
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
