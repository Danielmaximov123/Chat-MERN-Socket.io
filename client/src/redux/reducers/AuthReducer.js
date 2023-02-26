import jwtDecode from 'jwt-decode'

const initialState = {
  token : localStorage.getItem('token'),  
  auth: null,
  loading: false,
}

export const authReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_LOGIN' :
            return { ...state, 
                token : action.payload,
                auth : {...jwtDecode(action.payload)}
            }
        case 'AUTH_LOADING':
            return { ...state, loading : action.payload }
        case 'LOAD_USER':
            return { ...state, 
                token : action.payload,
                auth : {...jwtDecode(action.payload)}
            }
        case 'LOGOUT_AUTH':
            localStorage.clear()
            return { ...state, auth : null }
        default:
      return state;
    }
}