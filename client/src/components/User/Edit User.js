import { Box, Button, Chip, Grid, InputAdornment, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import UploadPhoto from './Upload Photo';
import ValidatePass from './Validate Pass';
import { deleteMyUser, updateUser } from '../../redux/action/UserAction';
import bcrypt from "bcryptjs-react";
import ChangePassword from './Change Password';
import ValidatePassToDelete from './Validate Pass To Delete';

const EditUser = ({socket}) => {
  const { loadingUpdate } = useSelector(state => state.users)
  const { auth } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({
        fName : '',
        lName : '',
        email : '',
        profilePicture : null,
        password : ''
    })
    const [validate, setValidate] = useState(false)
    const [changePass, setChangePass] = useState(false)
    const [deleteUser, setDeleteUser] = useState(false)

    const resetDefault = (e) => {
      e.preventDefault()
      setUserData(prevState => ({
        ...prevState,
        fName : auth.fName,
        lName : auth.lName,
        email : auth.email,
        profilePicture : auth.profilePicture,
        password: auth.password
      }))
    }
    

    const handleSubmit = (set , bool) => {
      dispatch(updateUser(auth._id , userData , socket))
      set(!bool)
    }

    const handleDelete = () => {
      dispatch(deleteMyUser(auth._id))
      socket.emit('user-logout', auth._id)
      socket.emit('delete-user', auth._id)
    }

    useEffect(() => {
        if(auth) {
          if (!userData.fName && !userData.lName && !userData.email && !userData.profilePicture && !userData.password) {
            setUserData({
              fName : auth.fName,
              lName : auth.lName,
              email : auth.email,
              profilePicture : auth.profilePicture,
              password : auth.password
            })
            }
        }
    },[auth , userData])

  return (
    <Box className="edit-user-box" sx={{ padding: '0rem 0rem' }}>
        <p style={{ textAlign : 'center' , fontSize: '2rem' }}>{userData.fName} {userData.lName}</p>
        <UploadPhoto socket={socket} loadingUpdate={loadingUpdate} user={auth}/>
        <Box sx={{textAlign: 'center' , margin : '3rem'}}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} >
          <TextField
          fullWidth
          sx={{ margin: '0.2rem' }}
          label="First Name"
          value={userData.fName || ''}
          variant="outlined"
          onChange={e => setUserData({...userData, fName : e.target.value})}
        />
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
          <TextField
          fullWidth
          sx={{ margin: '0.2rem' }}
          label="Last Name"
          value={userData.lName || ''}
          variant="outlined"
          onChange={e => setUserData({...userData, lName : e.target.value})}
        />
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
            <TextField
            fullWidth
            sx={{ margin: '0.2rem' }}
            label="Password"
            value={userData.password || ''}
            variant="outlined"
            disabled
            type='password'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                <Chip color="warning" label="Change Password" onClick={() => setChangePass(!changePass)} />
              </InputAdornment>
              ),
            }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
          <TextField
          fullWidth
          sx={{ margin: '0.2rem' }}
          label="Email"
          type='email'
          value={userData.email || ''}
          variant="outlined"
          onChange={e => setUserData({...userData, email : e.target.value})}
        />
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
            <Button sx={{ margin: '0.2rem' }} type='reset' onClick={resetDefault} fullWidth color='warning' variant='contained'>Reset to default</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
            <Button sx={{ margin: '0.2rem' }} onClick={() => setValidate(!validate)} type='button' fullWidth variant='contained'>Update User</Button>
          </Grid>
          <Grid item xs={12} sm={12} md={12} >
            <Button sx={{ margin: '0.2rem' }} onClick={() => setDeleteUser(!deleteUser)} color="error" type='button' fullWidth variant='contained'>Delete My User</Button>
          </Grid>
        </Grid>
        </Box>
        <ValidatePass bcrypt={bcrypt} validate={validate} setValidate={setValidate} handleSubmit={handleSubmit} userData={userData}/>
        <ValidatePassToDelete socket={socket} bcrypt={bcrypt} deleteUser={deleteUser} setDeleteUser={setDeleteUser} handleDelete={handleDelete} userData={userData}/>
        <ChangePassword bcrypt={bcrypt} changePass={changePass} setChangePass={setChangePass} setUserData={setUserData} user={auth}/>
    </Box>
  )
}

export default EditUser