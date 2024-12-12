import React, { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress
} from "@mui/material"

import { useNavigate } from "react-router-dom"
import api from "../../api/api";
import { toast } from 'react-toastify'
import { useDispatch } from "react-redux"
import { loginSuccess } from "../application/slice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validate = () => {
    const tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required."
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Invalid email format."
    if (!formData.password) tempErrors.password = "Password is required."
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (validate()) {
      console.log("Form Data:", formData)
      setIsLoading(true)
      try {
        const response = await api.post(
          "/auth/login/",
          { 
            "email": formData.email,
            "password": formData.password,
          }
        )
        if (response.status === 200) {
          console.log(response)
          const { token, user } = response.data;
          dispatch(loginSuccess({ token, user }))
          toast.success("Login Successfully")
          if(user.is_mfa_enabled){
            navigate('/auth/mfa_verification')
          }else{
            navigate('/auth/mfa_registration')
          }
        } else {
          toast.error(`Error:${response?.email?.[0]}`)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Error:${error}`)
      }
      setIsLoading(false)
    }
  };

  const handleRegisterBtn = () => {
    navigate("/auth/register");
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
      </Box>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                color: 'green',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleRegisterBtn}
        >
          Register
        </Button>
      </Box>
    </Paper>
  );
};

export default Login;
