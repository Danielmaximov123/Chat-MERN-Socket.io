import axios from "axios"

export const getUserChats = async (id)  => {
    let resp = await axios.get(`${process.env.REACT_APP_URL_API}/chat/${id}`)
    return resp.data
}