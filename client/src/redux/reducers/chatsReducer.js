import jwtDecode from 'jwt-decode'

const initialState = {
  loading: false,
}

export const authReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_CHAT' :
            return { ...state, 
                token : action.payload,
                auth : {...jwtDecode(action.payload)}
            }
        case 'AUTH_LOADING':
            return { ...state, loading : action.payload }
        default:
      return state;
    }
}