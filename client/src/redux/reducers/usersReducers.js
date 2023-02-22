import jwtDecode from 'jwt-decode'

const initialState = {
  users : [],
  loading: false,
}

export const usersReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_USERS' :
            return state = { ...state , users : action.payload }
        case 'USER_LOADING':
            return { ...state, loading : action.payload }
        default:
      return state;
    }
}