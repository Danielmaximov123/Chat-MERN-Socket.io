import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
const socket = io.connect(process.env.REACT_APP_URL_API);

const MainPage = () => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const {auth , loading} = useSelector((state) => state.auth)
    const { users , userLoading } = useSelector(state => state.users)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleGetUsers = (users) => {
          setOnlineUsers(users);
        };
      
        socket.on('get-users', handleGetUsers);
        
        return () => {
          socket.off('get-users', handleGetUsers)
        };
      }, []);

      useEffect(() => {
        function handleResize() {
          setWindowWidth(window.innerWidth);
        }
    
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

  return (
    <>

            <Routes>
          <Route
            path="/"
            element={auth ? <Home socket={socket} user={auth} setOnlineUsers={setOnlineUsers} onlineUsers={onlineUsers} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!auth ? <Login socket={socket} windowWidth={windowWidth} onlineUsers={onlineUsers}/> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!auth ? <Register windowWidth={windowWidth} socket={socket}/> : <Navigate to="/" />}
          />
        </Routes>
    </>
  )
}

export default MainPage