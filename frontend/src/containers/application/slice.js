import { createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        user: null,
        userslist: []
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setUsersList: (state, action) => {
            state.userslist = action.payload
        },
        logout: (state) => {
            localStorage.removeItem('token')
            state.token = null
            state.user = null
        },
    },
})

export const {
    loginSuccess,
    setUser,
    setUsersList,
    logout 
} = authSlice.actions

export default authSlice.reducer

export const fetchUsersList = () => async (dispatch) => {
    try {
      const response = await api.get('/auth/users/',{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }},
      )
      dispatch(setUsersList(response.data))
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }
