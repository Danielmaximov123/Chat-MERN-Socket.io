import { LoadingButton } from '@mui/lab'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import style from '../styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logIn, signUp } from '../redux/action/AuthAction'

const Register = () => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState({ email: '', username: '', password: '' })

  return (
    <Box sx={style.mainBoxInAuthPage}>
      <Box
        sx={{
          width: '33.33333%',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
        }}
        component="form"
        onSubmit={signUp(user)}
      >
        <h1 style={{ textAlign: 'center' }}>Register</h1>
        <TextField
          sx={{ margin: '0.2rem' }}
          fullWidth
          id="outlined-basic"
          label="Username"
          variant="outlined"
          onChange={e => setUser({...user, username : e.target.value})}
        />
        <TextField
          type="email"
          sx={{ margin: '0.2rem' }}
          fullWidth
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={e => setUser({...user, email : e.target.value})}
        />
        <TextField
          type={visible ? 'text' : 'password'}
          sx={{ margin: '0.2rem' }}
          fullWidth
          id="outlined-basic"
          label="Password"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setVisible(!visible)}>
                  {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={e => setUser({...user, password : e.target.value})}
        />
        <Link to="/login" style={{ margin: '0.2rem' }}>
          Already have user ? Click Here
        </Link>
        <LoadingButton type='submit' sx={{ margin: '0.2rem' }} fullWidth variant="contained">
          Register
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default Register
