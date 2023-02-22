import axios from "axios"

export const getUser = async (id)  => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/user/${id}`)
    return resp.data
}

export const getAllUsers = () => async dispatch => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/user`)
    dispatch({ type : 'GET_USERS' , payload : resp.data })
}