import { applyMiddleware , createStore , combineReducers } from "redux"
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import { authReducer } from './reducers/AuthReducer';



const reducers = combineReducers({
    auth : authReducer
})

const store = createStore(reducers , composeWithDevTools(applyMiddleware(thunk)))

export default store