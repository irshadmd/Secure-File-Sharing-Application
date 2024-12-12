import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate, } from 'react-router-dom'
import { logout, setUser } from './slice'
import api from '../../api/api'

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch()
    const { token, user } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (token && !user) {
            api.get('/auth/clientInfo/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                dispatch(setUser(response.data))
            })
            .catch(() => {
                dispatch(logout())
                navigate('/login')
                console.error('Failed to fetch user info')
            })
        }
    }, [])

    if (!token) {
        return <Navigate to="/login" />
    }

    return children
}

export default ProtectedRoute