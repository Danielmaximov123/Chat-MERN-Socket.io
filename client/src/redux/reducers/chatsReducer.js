import jwtDecode from 'jwt-decode'

const initialState = {
  chats : [],
  loading: false,
}

export const chatReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_CHATS' :
            return state = { ...state , chats : action.payload }
        case 'ADD_CHAT' :
            return  { ...state , chats : [ ...state.chats, action.payload ] }
        case 'CHAT_LOADING':
            return { ...state, loading : action.payload }
        default:
      return state;
    }
}