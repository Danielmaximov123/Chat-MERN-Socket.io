import { Box } from '@mui/material'
import { useBeforeUnload } from 'react-router-dom'
import {  useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { LoadUser } from './redux/action/AuthAction'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllUsers } from './redux/action/UserAction'
import MainPage from './main page'

const App = () => {
  const dispatch = useDispatch()  

  useEffect(() => {
    dispatch(LoadUser())
    dispatch(getAllUsers())
  }, [])

  useBeforeUnload(() => {
    localStorage.removeItem('currentChat')
    localStorage.removeItem('chatSelect')
    localStorage.removeItem('userId')
  })

  return (
    <Box className="App">
      <ToastContainer autoClose={2000}/>
        <MainPage/>
    </Box>
  )
}

export default App
