import jwtDecode from 'jwt-decode'

const initialState = {
  token : localStorage.getItem('token'),  
  auth: null,
  loading: false,
}

export const authReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_LOGIN' :
            let data = jwtDecode(action.payload);
            return { ...state, 
                token : action.payload,
                auth : data
            }
        case 'AUTH_LOADING':
            return { ...state, loading : action.payload }
            case 'LOAD_USER':
                let data1 = jwtDecode(action.payload);
                return {
                    ...state,
                    token : action.payload,
                    auth : data1
                }
        case 'LOGOUT_AUTH':
            localStorage.clear()
            return { ...state, auth : null }
        default:
      return state;
    }
}