import { LoadingButton } from '@mui/lab'
import { Box, Grid, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import style from '../styles'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signUp } from '../redux/action/AuthAction'
import CustomTextPassField from '../components/Custom Style/customTextPassField'
import UploadPhotoRegister from '../components/User/Upload Photo Register'

const Register = ({windowWidth}) => {
  const dispatch = useDispatch()
  const [user, setUser] = useState({ email: '', fName: '' , lName : '' , password: '' })
  const [profilePic, setProfilePic] = useState(null)

  console.log(profilePic);

  const handleSubmit = (e) => {
    e.preventDefault()
    let form = new FormData()
    form.append('photo' , profilePic)
    form.append('data' , JSON.stringify(user))
    dispatch(signUp(form))
  }

  return (
    <Box sx={style.mainBoxInAuthPage}>
      <Box
        sx={{
          width: windowWidth < 967 ? '70%' : windowWidth > 968 && windowWidth < 1099? '60%' : windowWidth > 1100 ? '40%' : '',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <h1 style={{ textAlign: 'center' }}>Register</h1>
        <Box sx={{ margin : '1rem' }}>
        <UploadPhotoRegister profilePic={profilePic} setProfilePic={setProfilePic}/>
        </Box>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} >
        <TextField
          sx={{ margin: '0.2rem' }}
          fullWidth
          label="First Name"
          variant="outlined"
          onChange={e => setUser({...user, fName : e.target.value})}
          />
          </Grid>
        <Grid item xs={12} sm={6} md={6} >
        <TextField
          sx={{ margin: '0.2rem' }}
          fullWidth
          label="Last Name"
          variant="outlined"
          onChange={e => setUser({...user, lName : e.target.value})}
          />
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
        <TextField
          type="email"
          sx={{ margin: '0.2rem' }}
          fullWidth
          label="Email"
          variant="outlined"
          onChange={e => setUser({...user, email : e.target.value})}
        />
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
        <CustomTextPassField
          onChange={e => setUser({...user, password : e.target.value})}
          sx={{ margin: '0.2rem' }}
          fullWidth
          label="Password"
          variant="outlined"
        />
          </Grid>
        </Grid>
        <Box style={{ margin: '0.5rem' }}>
        <Link to="/login">
          Already have user ? Click Here
        </Link>
        </Box>
        <LoadingButton type='submit' sx={{ margin: '0.2rem' }} fullWidth variant="contained">
          Register
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default Register
