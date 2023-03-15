import axios from "axios"

export const getUser = async (id)  => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/user/${id}`)
    return resp.data
}

export const getAllUsers = () => async dispatch => {
  dispatch({ type : 'USER_LOADING' , payload : true })
  let resp = await axios.get(`${process.env.REACT_APP_URL_API}/user`)

  await dispatch({ type : 'GET_USERS' , payload : resp.data })
  dispatch({ type : 'USER_LOADING' , payload : false })
}

export const updateUser = (id , data , socket) => async dispatch => {
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : true })
    let resp = await axios.put(`${process.env.REACT_APP_URL_API}/user/${id}` , data );
      socket.emit('update-user-details', resp.data)
    dispatch({ type : 'UPDATE_USER' , payload : resp.data })
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : false })  
}

export const deleteMyUser = (id , socket) => async dispatch => {
    await axios.delete(`${process.env.REACT_APP_URL_API}/user/${id}`);
    dispatch({ type: 'DELETE_USER' , payload : id })
    dispatch({type : 'LOGOUT_AUTH'}); 
    socket.emit('user-logout', id)
  }

export const updateProfilePic = (id , pic , socket) => async dispatch => {
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : true })
    let resp = await axios.put(`${process.env.REACT_APP_URL_API}/user/profile-photo/${id}` , pic ,{
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      socket.emit('update-user-details', resp.data)
    dispatch({ type : 'UPDATE_USER' , payload : resp.data })
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : false })  
}

export const deleteProfilePic = (id , socket) => async dispatch => {
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : true })
    let resp = await axios.delete(`${process.env.REACT_APP_URL_API}/user/profile-photo/${id}`);
    dispatch({ type : 'UPDATE_USER' , payload : resp.data })
    socket.emit('update-user-details', resp.data) 
    dispatch({ type : 'LOADING_USER_UPDATE' , payload : false })   
}