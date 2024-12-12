import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../containers/application/slice'

const rootReducer = combineReducers({
    auth: authReducer,
})

export default rootReducer
