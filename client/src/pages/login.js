import { LoadingButton } from '@mui/lab'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import style from '../styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Link } from 'react-router-dom'
import { logIn } from '../redux/action/AuthAction'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
  const [visible, setVisible] = useState(false)
  const loading = useSelector((state) => state.auth.loading);
  const [user, setUser] = useState({ email: '', password: '' })
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(logIn(user))
  }

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
        onSubmit={handleSubmit}
      >
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <TextField
          type="email"
          sx={{ margin: '0.2rem' }}
          fullWidth
          label="Email"
          variant="outlined"
          onChange={e => setUser({...user, email : e.target.value})}
        />
        <TextField
          type={visible ? 'text' : 'password'}
          sx={{ margin: '0.2rem' }}
          fullWidth
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
        <Link to="/register" style={{ margin: '0.2rem' }}>
          You do not have a user ? Register
        </Link>
        <LoadingButton loading={loading} type="submit" sx={{ margin: '0.2rem' }} fullWidth variant="contained">
          Login
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default Login
