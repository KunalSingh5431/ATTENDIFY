import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  HowToReg as RoleIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ role: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!formData.role) {
      toast.warn("Please select your role.");
      return;
    }
    if (!formData.email || !formData.password) {
      toast.warn("Please fill in both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log("User Role:", formData.role);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", formData.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!", { position: "top-right", autoClose: 2000 });

      setTimeout(() => {
      switch (formData.role) {
        case "student":
          navigate("/student-dashboard");
          break;
        case "faculty":
          navigate("/faculty-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    }, 2000);
    } catch (error) {
      toast.error(error.message || "Login failed", {
        position: "top-right",
        autoClose: 2000,
      });
    }
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
          sx={{
            width: "100%",
            maxWidth: "450px",
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
            padding: 4,
            textAlign: "center",
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
            Attendify - Sign In
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: "gray" }}>
            Please enter your credentials to continue
          </Typography>

          <FormControl component="fieldset" sx={{ width: "100%", marginBottom: 3 }}>
            <Typography
              variant="h8"
              sx={{ marginBottom: 1, color: "#6a11cb", display: "flex", alignItems: "center", gap: 1 ,marginLeft:18,fontWeight:"bold"}}
            >
              <RoleIcon />
              Select Your Role:
            </Typography>
            <RadioGroup
              name="role"
              row
              value={formData.role}
              onChange={handleChange}
              sx={{ justifyContent: "center" }}
            >
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="faculty" control={<Radio />} label="Faculty" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            </RadioGroup>
          </FormControl>

          <form onSubmit={handleLoginSubmit}>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="password"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
              <Checkbox checked={showPassword} onChange={toggleShowPassword} />
              <Typography variant="body2">Show Password</Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                paddingY: 1.5,
                backgroundColor: "#6a11cb",
                fontWeight: "bold",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#4a0f9c",
                },
              }}
            >
              Submit
            </Button>
          </form>

          {formData.role === "admin" && (
            <Link to="/signup" style={{ textDecoration:"none"}}>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 2,
                  fontWeight:700,
                  color: "#6a11cb",
                  fontSize: "15px",
                }}
              >
                Don't have an account? Sign Up
              </Typography>
            </Link>
          )}
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
