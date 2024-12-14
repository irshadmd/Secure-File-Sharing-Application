import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../containers/application/slice'
import filesReducer from '../containers/FileList/slice'
import sharedReducer from '../containers/SharedList/slice'
import quickShareReducer from '../containers/QuickShare/slice'

const rootReducer = combineReducers({
    auth: authReducer,
    files: filesReducer,
    shared: sharedReducer,
    quickshare: quickShareReducer
})

export default rootReducer
