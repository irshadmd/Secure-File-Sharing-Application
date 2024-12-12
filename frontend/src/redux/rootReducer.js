import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../containers/application/slice'
import filesReducer from '../containers/FileList/slice'

const rootReducer = combineReducers({
    auth: authReducer,
    files: filesReducer
})

export default rootReducer
