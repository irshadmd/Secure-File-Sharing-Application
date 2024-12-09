import { combineReducers } from '@reduxjs/toolkit'

import authenticationReducer from '../containers/authentication/reducer'

const rootReducer = combineReducers({
    authentication: authenticationReducer,
})

export default rootReducer
