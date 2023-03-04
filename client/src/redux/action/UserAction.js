import axios from "axios"
import jwtDecode from 'jwt-decode'

export const getUser = async (id)  => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/user/${id}`)
    return resp.data
}

export const getMyUser = async (token , dispatch) => { 
    dispatch({ type : 'USER_LOADING' , payload : true })   
    let getAuth = await jwtDecode(token)
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/user/${getAuth.id}`)
    dispatch({ type : 'GET_USER' , payload : resp.data })   
    dispatch({ type : 'USER_LOADING' , payload : false })   
}

export const getAllUsers = () => async dispatch => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/user`)
    dispatch({ type : 'GET_USERS' , payload : resp.data })
}

export const updateUser = (id , data , socket) => async dispatch => {
    console.log(data);
    console.log(id);
    // dispatch({ type : 'LOADING_USER_UPDATE' , payload : true })
    // let resp = await axios.put(`${process.env.REACT_APP_URL_API}/user/${id}` , data );
    //   socket.current.emit('update-user-details', resp.data)
    // dispatch({ type : 'UPDATE_USER' , payload : resp.data })
    // dispatch({ type : 'LOADING_USER_UPDATE' , payload : false })  
}

export const updateProfilePic = (id , pic , socket) => async dispatch => {
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : true })
    let resp = await axios.put(`${process.env.REACT_APP_URL_API}/user/profile-photo/${id}` , pic ,{
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      socket.current.emit('update-user-details', resp.data)
    dispatch({ type : 'UPDATE_USER' , payload : resp.data })
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : false })  
}

export const deleteProfilePic = (id , socket) => async dispatch => {
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : true })
    let resp = await axios.delete(`${process.env.REACT_APP_URL_API}/user/profile-photo/${id}`);
    dispatch({ type : 'UPDATE_USER' , payload : resp.data })
    socket.current.emit('update-user-details', resp.data) 
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : false })   
}