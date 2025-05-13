import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "",
    idno: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Signup successful!", { position: "top-center" });
      setTimeout(() => navigate("/login"), 2000); 

    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.message, { position: "top-center" });
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "95%",
          maxWidth: "600px",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
          }}
        >
          Attendify - Sign Up
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: "#555",
          }}
        >
          Create account to manage and access exclusive features.
        </Typography>
        
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            sx={{ mb: 2, maxWidth: "400px" }}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2, maxWidth: "400px" }}
          />
          <FormControl fullWidth sx={{ mb: 2, maxWidth: "400px" }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Identity Number"
            name="idno"
            variant="outlined"
            fullWidth
            value={formData.idno}
            onChange={handleChange}
            sx={{ mb: 2, maxWidth: "400px" }}
          />
          <TextField
            label="Password"
            name="password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2, maxWidth: "400px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 3, maxWidth: "400px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "#6a11cb",
              maxWidth: "400px",
              "&:hover": { backgroundColor: "#4a0f9c" },
            }}
          >
            Sign Up
          </Button>
        <Link to="/login" style={{ textDecoration:"none"}}>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 2,
            color: "#6a11cb",
            fontWeight:700,
            cursor: "pointer",
            "&:hover": { color: "#4a0f9c" },
          }}
        >
          Already have an account? Login
        </Typography>
        </Link>
      </Box>
    </Box>
    </>
  );
};

export default Signup;
