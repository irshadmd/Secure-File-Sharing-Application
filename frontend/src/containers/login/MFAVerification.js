import React, { useEffect, useState } from "react"
import { Box, Typography, TextField, Button, Paper } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import api from "../../api/api"
import { toast } from "react-toastify"

const MFAVerification = () => {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }

  useEffect(()=> {
    if(!token) navigate('/login')
  },[])

  const token = useSelector((state) => state.auth.token)
  console.log(token)
  

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    setIsLoading(true)
    try {
      const response = await api.post(
        "/auth/mfa/validate/",
        { "otp": otp},{
          headers: {
          Authorization: 'Bearer ' + token
        }}
      )
      console.log(otp)
      if (response.status === 200) {
          localStorage.setItem("token", token)
          toast.success("Validated Successfully")
          navigate("/")
      } else {
        toast.error(`An error occurred while verifying OTP.`)
      }
    } catch (error) {
      console.log(error)
      toast.error(`Error:${error}`)
    }
    setIsLoading(false)  
  }

  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
            Verify Your MFA Code
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Please enter the OTP from Google Authenticator.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
            </Typography>
            )}
            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              margin="normal"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              error={!!error}
              helperText={error && "Please enter a valid OTP"}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={otp.length < 4 || isLoading}
            >
            Verify OTP
            </Button>
        </Box>
    </Paper>
  )
}

export default MFAVerification
