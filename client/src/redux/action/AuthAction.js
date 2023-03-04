import axios from "axios"
import { getMyUser } from "./UserAction"

export const logIn = (data) => async (dispatch) => {
  dispatch({ type: 'AUTH_LOADING' , payload : true })
  try {
      let resp = await axios.post(`${process.env.REACT_APP_URL_API}/auth/login` , data)
      const { success , token , message } = resp.data
      if(success) {
          localStorage.setItem('token' , token)
          await getMyUser(token , dispatch)
          dispatch({ type: 'GET_LOGIN', payload: token })
          dispatch({ type: 'AUTH_LOADING' , payload : false })
        } else {
            console.log(message);
          dispatch({ type: 'AUTH_LOADING' , payload : false })
      }
  } catch (error) {
    dispatch({ type: 'AUTH_LOADING' , payload : false })
  }
}

export const LoadUser = () => {
    return (dispatch , getState) => {
        dispatch({ type: 'AUTH_LOADING' , payload : true })
        const token = getState()?.auth?.token
        dispatch({ type: 'AUTH_LOADING' , payload : false })
        if(token) {
            dispatch({ type : 'LOAD_USER' , payload : token })
        } else {
            if(token) {
                dispatch({ type : 'LOAD_USER' , payload : token })
            } else return null
        }
    }
}

export const signUp = (formData) => async (dispatch) => {
//   dispatch({ type: 'AUTH_START' })
  try {

  } catch (error) {
    console.log(error)
    // dispatch({ type: 'AUTH_FAIL' })
  }
}
