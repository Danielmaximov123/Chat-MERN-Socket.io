import axios from "axios"

export const getUserChats = (id) => async dispatch => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/chat/${id}`)
    dispatch({ type : 'GET_CHATS' , payload : resp.data })
    
}

export const createChat = (data , socket ) => async dispatch => {
    let resp = await axios.post(`${process.env.REACT_APP_URL_API}/chat` , data)
     dispatch({ type: 'ADD_CHAT', payload: resp.data })
     socket.emit('create-chat', resp.data);
}

export const getChatById = async (chatId) => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/chat/get-chat/${chatId}`)
    return resp.data
}