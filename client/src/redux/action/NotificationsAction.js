import axios from "axios"

export const getNotifications = (id) => async dispatch => {
    dispatch({ type : 'GET_NOTIFICATIONS' , payload : true })
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/notification/${id}`)
    dispatch({ type : 'GET_MESSAGES' , payload : resp.data })
    dispatch({ type : 'GET_NOTIFICATIONS' , payload : false })
}

export const postNotifications = (data) => async (dispatch) => {
    let resp = await axios.post(`${process.env.REACT_APP_URL_API}/notification` , data)
    dispatch({ type : 'ADD_NOTIFICATION' , payload : resp.data })
    return resp.data
}

export const removeNotification = (chatId) => async  dispatch => {
    await axios.delete(`${process.env.REACT_APP_URL_API}/notification` , chatId)
    dispatch({ type : 'DELETE_NOTIFICATION' , payload : chatId })
}