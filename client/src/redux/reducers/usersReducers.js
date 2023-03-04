const initialState = {
  users : [],
  loadingUpdate: false,
  userLoading : false
}

export const usersReducer = (state = initialState , action) => {
    switch(action.type) {
        case 'GET_USERS' :
            return state = { ...state , users : action.payload }
        case 'UPDATE_USER':
          return {
            ...state,
            users: state.users.map((user) =>
              user._id === action.payload._id ? action.payload : user
            ),
          };
        case 'USER_LOADING':
            return { ...state, userLoading : action.payload }
        case 'LOADING_USER_UPDATE':
            return { ...state, loadingUpdate : action.payload }
        default:
      return state;
    }
}
