import React from "react"
import { Navigate, Route, Routes } from 'react-router-dom'
import Page404 from '../../components/page404'
import Register from "../register"
import Login from "../login"
import {
    Box,
} from "@mui/material";
import MFARegistration from "../register/MFARegistration"
import MFAVerification from "../login/MFAVerification"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from "./ProtectedRoute"
import MainRoutes from "./MainRoutes"


const AuthRoutes = () => (<div>
    <Box sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1681487724373-cd132ba36046?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 2,
    }}>
        <Routes>
            <Route
                index
                element={<Navigate to="/auth/login" replace />}
            />
            <Route
                path="/register"
                element={<Register />}
            />
            <Route
                path="/mfa_registration"
                element={<MFARegistration />}
            />
            <Route
                path="/login"
                element={<Login />}
            />
            <Route
                path="/mfa_verification"
                element={<MFAVerification />}
            />
            <Route
                path="*"
                element={<Page404 />}
            />
        </Routes>
    </Box>
</div>)

const Application = () => {
    
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route
                    index
                    element={<Navigate to="/app" replace />}
                />
                <Route
                    index
                    path="app/*"
                    element={
                        <ProtectedRoute>
                            <MainRoutes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="auth/*"
                    element={
                        <AuthRoutes />
                    }
                />
                <Route
                    path="*"
                    element={<Page404 />}
                />
            </Routes>
        </div>
        
    )
}
export default Application
  