
const initialState = {
  notifications : [],
  loading: false,
}

export const notificationsReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_NOTIFICATIONS' :
            return state = { ...state , notifications : action.payload }
        case 'ADD_NOTIFICATION' :
            return  { ...state , notifications : [ ...state.notifications, action.payload ] }
        case 'DELETE_NOTIFICATION':
            return  { ...state , notifications : state.notifications.filter(notification => notification.chatId !== action.payload.chatId) }
        case 'NOTIFICATION_LOADING':
            return { ...state, loading : action.payload }
        default:
      return state;
    }
}