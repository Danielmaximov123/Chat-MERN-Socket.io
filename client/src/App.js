import { Box } from '@mui/material'
import { Navigate, Route, Routes, useBeforeUnload } from 'react-router-dom'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { LoadUser } from './redux/action/AuthAction'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from 'socket.io-client';
import { getAllUsers } from './redux/action/UserAction'
const socket = io.connect(process.env.REACT_APP_URL_API);

const App = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth.auth)
  const { users , userLoading} = useSelector(state => state.users)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    dispatch(LoadUser())
    dispatch(getAllUsers())
  }, [dispatch])

  useEffect(() => {
    const findUser = () => {
      const foundUser = users?.find(user => user?._id === auth?.id);
      setUser(foundUser);
      localStorage.setItem('userId' , foundUser?._id)
    };
    findUser();
  }, [users, auth , dispatch]);
  

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useBeforeUnload(() => {
    localStorage.removeItem('currentChat')
    localStorage.removeItem('chatSelect')
  })

  useEffect(() => {
    const handleGetUsers = (users) => {
      setOnlineUsers(users);
    };
  
    socket.on('get-users', handleGetUsers);
    
    return () => {
      socket.off('get-users', handleGetUsers)
    };
  }, []);
  

  return (
    <Box className="App">
      <ToastContainer autoClose={2000}/>
        {
          userLoading ? "" :
          <Routes>
          <Route
            path="/"
            element={auth ? <Home socket={socket} user={user} setOnlineUsers={setOnlineUsers} onlineUsers={onlineUsers} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!auth ? <Login socket={socket} windowWidth={windowWidth} onlineUsers={onlineUsers}/> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!auth ? <Register windowWidth={windowWidth}/> : <Navigate to="/" />}
          />
        </Routes>
        }
    </Box>
  )
}

export default App
