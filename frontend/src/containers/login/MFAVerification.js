import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MFAVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Simulating the secret stored on the server (for demo purposes)
  const storedSecret = "JBSWY3DPEHPK3PXP"; // This should be securely fetched from your server

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Simulate OTP verification (replace with backend verification in practice)
  const verifyOtp = async (otp) => {
    try {
      // In a real-world scenario, send the OTP to your backend for verification
      const isValid = await verifyOtpOnServer(otp);
      if (isValid) {
        navigate("/");
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying OTP.");
    }
  };

  // Simulate OTP verification on the server side
  const verifyOtpOnServer = async (otp) => {
    // const speakeasy = require("speakeasy");

    // // Verify the OTP using the secret key and the entered OTP
    // const verified = speakeasy.totp.verify({
    //   secret: storedSecret,
    //   encoding: "base32",
    //   token: otp,
    // });

    // return verified;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // verifyOtp(otp);
  };

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
            disabled={otp.length < 4}
            >
            Verify OTP
            </Button>
        </Box>
    </Paper>
  );
};

export default MFAVerification
