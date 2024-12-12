import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material"

import { useNavigate } from "react-router-dom"
import api from "../../api/api";
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required."
    if (!formData.email) tempErrors.email = "Email is required."
    if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid."
    if (!formData.password)
      tempErrors.password = "Password is required."
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match."
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) =>  {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
      try {
        const response = await api.post(
          "/auth/register/",
          { 
            "name": formData.name,
            "email": formData.email,
            "password": formData.password,
            "role": formData.role
           }
        )
        if (response.status === 201) {
          toast.success("Registered Successfully")
          navigate("/auth/login");
        } else {
          toast.error(`Error:${response?.email?.[0]}`)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Error:${error}`)
      }
      setIsLoading(false)
    }
  }

  const handleLoginBtn = () => {
    navigate("/auth/login")
  }

  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
      </Box>
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
          id="name"
          label="Name"
          name="name"
          autoComplete="given-name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="GUEST">GUEST</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            Register
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
          onClick={handleLoginBtn}
        >
          Login
        </Button>
      </Box>
    </Paper>
  )
}

export default Register
