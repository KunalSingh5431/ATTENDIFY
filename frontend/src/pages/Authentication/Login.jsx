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
} from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleOpenCamera = () => {
    alert("Opening Camera for Face ID...");
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (loginMethod === "email") {
      if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Login successful!");
          console.log("Login response:", data);
        } else {
          alert(data.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
      }
    } else {
      alert("Face ID login functionality is not implemented yet.");
    }
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
            color: "#6a11cb",
            marginBottom: 3,
          }}
        >
          Attendify Login
        </Typography>

        <FormControl component="fieldset" sx={{ width: "100%", marginBottom: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#6a11cb" }}>
            Select Your Role:
          </Typography>
          <RadioGroup
            row
            value={role}
            onChange={handleRoleChange}
            sx={{ justifyContent: "center" }}
          >
            <FormControlLabel
              value="student"
              control={<Radio />}
              label="Student"
            />
            <FormControlLabel
              value="faculty"
              control={<Radio />}
              label="Faculty"
            />
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label="Admin"
            />
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <Button
            variant={loginMethod === "email" ? "contained" : "outlined"}
            onClick={() => handleLoginMethodChange("email")}
            sx={{
              width: "48%",
              backgroundColor: loginMethod === "email" ? "#6a11cb" : "#ffffff",
              color: loginMethod === "email" ? "#ffffff" : "#6a11cb",
              borderColor: "#6a11cb",
              fontWeight: "bold",
            }}
          >
            Email & Password
          </Button>
          <Button
            variant={loginMethod === "face" ? "contained" : "outlined"}
            onClick={() => handleLoginMethodChange("face")}
            sx={{
              width: "48%",
              backgroundColor: loginMethod === "face" ? "#6a11cb" : "#ffffff",
              color: loginMethod === "face" ? "#ffffff" : "#6a11cb",
              borderColor: "#6a11cb",
              fontWeight: "bold",
            }}
          >
            Face ID
          </Button>
        </Box>

        <form onSubmit={handleLoginSubmit}>
          {loginMethod === "email" && (
            <>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
                <Checkbox checked={showPassword} onChange={toggleShowPassword} />
                <Typography variant="body2">Show Password</Typography>
              </Box>
            </>
          )}
          {loginMethod === "face" && (
            <Box sx={{ textAlign: "center", marginBottom: 3 }}>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Use your camera for Face ID verification.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenCamera}
              >
                Open Camera
              </Button>
            </Box>
          )}
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

        {role === "admin" && (
          <Link to="/signup">
            <Typography
              variant="body2"
              sx={{ marginTop: 2, textDecoration: "underline", color: "#6a11cb" }}
            >
              Don't have an account? Sign Up
            </Typography>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
