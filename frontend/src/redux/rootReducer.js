import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../containers/application/slice'
import filesReducer from '../containers/FileList/slice'
import sharedReducer from '../containers/SharedList/slice'

const rootReducer = combineReducers({
    auth: authReducer,
    files: filesReducer,
    shared: sharedReducer
})

export default rootReducer
