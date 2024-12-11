import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../containers/login/slice'

const rootReducer = combineReducers({
    auth: authReducer,
})

export default rootReducer
