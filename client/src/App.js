import { Box } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { LoadUser } from './redux/action/AuthAction'
import { getMyUser } from './redux/action/UserAction'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth.auth)
  const { users , userLoading} = useSelector(state => state.users)
  let user = users?.find(user => user?._id === auth?.id)

  useEffect(() => {
    dispatch(LoadUser())
  }, [dispatch])

  return (
    <Box className="App">
      <ToastContainer autoClose={2000}/>
        {
          userLoading ? "" :
          <Routes>
          <Route
            path="/"
            element={auth ? <Home user={user} auth={auth} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!auth ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!auth ? <Register /> : <Navigate to="/" />}
          />
        </Routes>
        }
    </Box>
  )
}

export default App
