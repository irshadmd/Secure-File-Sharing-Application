import React, { useEffect, useState } from "react"
import { Box, Typography, TextField, Button, Paper, CircularProgress } from "@mui/material"
import {QRCodeSVG} from "qrcode.react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import api from "../../api/api";
import { toast } from "react-toastify";

const MFARegistration = () => {
  const [secret, setSecret] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  const navigate = useNavigate()

  const token = useSelector((state) => state.auth.token)
  const [otp, setOtp] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }

  const fetchQRCode= async() => {
    try {
        const response = await api.get(
          "/auth/mfa/generate/",{
            headers: {
            Authorization: 'Bearer ' + token
          }}
        )
        if (response.status === 200) {
          console.log(response)

          const {secret, qr_code_url} = response.data
          setSecret(secret)
          setQrCodeUrl(qr_code_url)
          
        } else {
          toast.error(`Error:${response}`)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Error:${error}`)
      }
  }

  useEffect(()=> {
    if(!token) navigate('/auth/login')
    fetchQRCode()
  },[])

  const handleSubmit = async (e) =>  {
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
            Register for MFA
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
            Use Google Authenticator to scan the QR code below.
        </Typography>

        {qrCodeUrl ? (
            <Box sx={{ textAlign: "center", mb: 2 }}>
            <QRCodeSVG value={qrCodeUrl} size={200} />
            <Typography variant="body2" sx={{ mt: 2 }}>
                Secret Key: <strong>{secret}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                If you can't scan the QR code, enter the key manually in Google
                Authenticator.
            </Typography>
            </Box>
        ) : (
            <CircularProgress />
        )}
        <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
        >
            <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                name="otp"
                label="Enter OTP Code"
                variant="outlined"
                type="text"
                autoFocus
                value={otp}
                onChange={handleOtpChange}
                error={!!errors.otp}
                helperText={errors && "Please enter a valid OTP"}
            />
            <Button 
                fullWidth 
                variant="contained" 
                disabled={otp.length < 4 || isLoading} 
                type="submit" 
                sx={{ mt: 2 }}
            >
                Verify OTP
            </Button>
        </Box>
    </Paper>
  );
};

export default MFARegistration;
