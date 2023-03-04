
const initialState = {
  messages : [],
  loading: false,
}

export const messagesReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_MESSAGES' :
            return state = { ...state , messages : action.payload }
        case 'ADD_MESSAGE' :
            return  { ...state , messages : [ ...state.messages, action.payload ] }
        case 'MESSAGE_LOADING':
            return { ...state, loading : action.payload }
        default:
      return state;
    }
}