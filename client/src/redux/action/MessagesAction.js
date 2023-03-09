import axios from "axios"

export const getMessages = (chatId) => async dispatch => {
    dispatch({ type : 'MESSAGE_LOADING' , payload : true })
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/messages/${chatId}`)
    dispatch({ type : 'GET_MESSAGES' , payload : resp.data })
    dispatch({ type : 'MESSAGE_LOADING' , payload : false })
}

export const getMessagesForConversation = async (chatId) => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/messages/${chatId}`)
    return resp.data
}

export const postMessages = (data ) => async (dispatch , getState) => {
    let resp = await axios.post(`${process.env.REACT_APP_URL_API}/messages` , data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    dispatch({ type : 'ADD_MESSAGE' , payload : resp.data })
    return resp.data
}