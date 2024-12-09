import React from "react"
import { Route, Routes } from 'react-router-dom'
import Page404 from '../../components/page404'
import Authentication from "../authentication"
import Register from "../register"
import Login from "../login"
import {
    Box,
} from "@mui/material";
import MFARegistration from "../register/MFARegistration"
import MFAVerification from "../login/MFAVerification"

const Application = () => {
    
    return (
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
                    path="/"
                    element={<Authentication />}
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
    )
}
export default Application
  