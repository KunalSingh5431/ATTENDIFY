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

const Signup = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState(""); // State for role selection

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
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
            mb: 1,
            color: "#6a11cb",
          }}
        >
          Admin Signup
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: "#555",
          }}
        >
          Create your admin account to manage and access exclusive features.
        </Typography>

        <Box
          sx={{
            width: "100%",
            padding: 3,
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 2, maxWidth: "400px" }}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            sx={{ mb: 2, maxWidth: "400px" }}
          />
          <FormControl fullWidth sx={{ mb: 2, maxWidth: "400px" }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Identity Number"
            variant="outlined"
            fullWidth
            sx={{ mb: 2, maxWidth: "400px" }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        </Box>
        <Link to="/login">
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 2,
            color: "#6a11cb",
            textDecoration: "underline",
            cursor: "pointer",
            "&:hover": { color: "#4a0f9c" },
          }}
          onClick={() => {
            alert("Redirect to Login Page");
          }}
        >
          Already have an account? Login
        </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Signup;
