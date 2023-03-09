import { applyMiddleware , createStore , combineReducers } from "redux"
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import { authReducer } from './reducers/AuthReducer';
import { chatReducer } from "./reducers/chatsReducer";
import { usersReducer } from "./reducers/usersReducers";
import { messagesReducer } from './reducers/messagesReducer';
import { notificationsReducer } from './reducers/notificationsReducer';

const reducers = combineReducers({
    auth : authReducer,
    chats : chatReducer,
    users : usersReducer,
    messages : messagesReducer,
    notifications : notificationsReducer
})

const store = createStore(reducers , composeWithDevTools(applyMiddleware(thunk)))

export default store