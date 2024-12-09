import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import {QRCodeSVG} from "qrcode.react";

const MFARegistration = () => {
  const [secret, setSecret] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateMfaSecret = () => {
    const fakeSecret = "JBSWY3DPEHPK3PXP";
    const appName = "Secure_File_Sharing_Application";
    const userEmail = "user@example.com"; // Replace with the actual user's email

    // Generate QR code URL using the otpauth:// URL scheme
    const otpauthUrl = `otpauth://totp/${appName}:${userEmail}?secret=${fakeSecret}&issuer=${appName}`;
    setSecret(fakeSecret);
    setQrCodeUrl(otpauthUrl);
  };

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
        <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button
            variant="contained"
            onClick={generateMfaSecret}
            sx={{ mt: 3 }}
        >
            Generate MFA Setup
        </Button>
        </Box>
    )}
    <TextField
        fullWidth
        label="Enter OTP Code"
        variant="outlined"
        margin="normal"
        type="text"
    />
    <Button fullWidth variant="contained" sx={{ mt: 2 }}>
        Verify OTP
    </Button>
    </Paper>
  );
};

export default MFARegistration;
