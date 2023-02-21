import axios from "axios"

export const getMessages = async (chatId)  => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/messages/${chatId}`)
    return resp.data
}


export const postMessages = async (data)  => {
    let resp = await axios.post(`${process.env.REACT_APP_URL_API}/messages` , data)
    return resp.data
}