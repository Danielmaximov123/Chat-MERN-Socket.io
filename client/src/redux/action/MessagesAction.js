import axios from "axios"

export const getMessages = (chatId) => async dispatch => {
    dispatch({ type : 'MESSAGE_LOADING' , payload : true })
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/messages/${chatId}`)
    dispatch({ type : 'GET_MESSAGES' , payload : resp.data })
    dispatch({ type : 'MESSAGE_LOADING' , payload : false })
}

export const postMessages = (data , socket , receiverId) => async dispatch => {
    let resp = await axios.post(`${process.env.REACT_APP_URL_API}/messages` , data)
    dispatch({ type : 'ADD_MESSAGE' , payload : resp.data })
    socket.current.emit('send-message', {receiverId , data : resp.data})
}