import { Box, Button, Grid, IconButton, InputAdornment, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import UploadPhoto from './Upload Photo';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ValidatePass from './Validate Pass';
import CustomTextPassField from '../Custom Style/customTextPassField';
import { updateUser } from '../../redux/action/UserAction';

const EditUser = ({socket}) => {
  const { loadingUpdate , users } = useSelector(state => state.users)
  const { auth } = useSelector(state => state.auth)
  let user = users?.find(user => user?._id === auth?.id)
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({
        fName : '',
        lName : '',
        email : '',
        profilePicture : null,
        password : ''
    })
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')

    const resetDefault = (e) => {
      e.preventDefault()
      setUserData(prevState => ({
        ...prevState,
        fName : user.fName,
        lName : user.lName,
        email : user.email,
        profilePicture : user.profilePicture,
        password: user.password
      }))
    }
    

    const handleSubmit = () => {
      dispatch(updateUser(user._id , user , socket))
    }

    useEffect(() => {
        if(user) {
          if (!userData.fName && !userData.lName && !userData.email && !userData.profilePicture) {
            setUserData({
              fName : user.fName,
              lName : user.lName,
              email : user.email,
              profilePicture : user.profilePicture
            })
            }
        }
    },[user , userData])

  return (
    <Box sx={{ padding: '4rem 4rem' }}>
        <p style={{ textAlign : 'center' , fontSize: '2rem' }}>{userData.fName} {userData.lName}</p>
        <UploadPhoto socket={socket} loadingUpdate={loadingUpdate} user={user}/>
        <Box sx={{textAlign: 'center' , margin : '3rem'}}>
        <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={12} md={6} >
          <TextField
          fullWidth
          sx={{ margin: '0.2rem' }}
          label="First Name"
          value={userData.fName || ''}
          variant="outlined"
          onChange={e => setUserData({...userData, fName : e.target.value})}
        />
          </Grid>
          <Grid item xs={12} sm={12} md={6} >
          <TextField
          fullWidth
          sx={{ margin: '0.2rem' }}
          label="Last Name"
          value={userData.lName || ''}
          variant="outlined"
          onChange={e => setUserData({...userData, lName : e.target.value})}
        />
          </Grid>
          <Grid item xs={12} sm={12} md={6} >
            <CustomTextPassField
            fullWidth
            sx={{ margin: '0.2rem' }}
            label="Password"
            value={password || ''}
            variant="outlined"
            onChange={e => {setPassword(e.target.value); setUserData({...userData, password : e.target.value})}}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} >
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
          <Grid item xs={12} sm={12} md={6} >
            <Button sx={{ margin: '0.2rem' }} type='reset' onClick={resetDefault} fullWidth color='warning' variant='contained'>Reset to default</Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6} >
            <Button sx={{ margin: '0.2rem' }} onClick={() => setOpen(!open)} type='button' fullWidth variant='contained'>Update User</Button>
          </Grid>
        </Grid>
        </Box>
        <ValidatePass open={open} setOpen={setOpen} handleSubmit={handleSubmit} user={user}/>
    </Box>
  )
}

export default EditUser