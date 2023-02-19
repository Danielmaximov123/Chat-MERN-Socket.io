import { Box } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { LoadUser } from './redux/action/AuthAction'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.auth)

  useEffect(() => {
    dispatch(LoadUser())
  }, [dispatch])

  return (
    <Box className="App">
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
        </Routes>
    </Box>
  )
}

export default App
