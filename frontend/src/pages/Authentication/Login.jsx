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
          maxWidth: "500px",
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
            mb: 3,
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Attendify Login
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 4, width: "100%" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#6a11cb", fontWeight: "bold" }}>
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
              sx={{ color: "#6a11cb" }}
            />
            <FormControlLabel
              value="faculty"
              control={<Radio />}
              label="Faculty"
              sx={{ color: "#6a11cb" }}
            />
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label="Admin"
              sx={{ color: "#6a11cb" }}
            />
          </RadioGroup>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            mb: 3,
          }}
        >
          <Button
            variant={loginMethod === "email" ? "contained" : "outlined"}
            onClick={() => handleLoginMethodChange("email")}
            sx={{
              fontWeight: "bold",
              backgroundColor: loginMethod === "email" ? "#ff6f61" : "transparent",
              color: loginMethod === "email" ? "#fff" : "#ff6f61",
              borderColor: "#ff6f61",
              "&:hover": {
                backgroundColor: loginMethod === "email" ? "#e55d50" : "#ff6f61",
                color: "#fff",
              },
              width: "50%",
            }}
          >
            Email & Password
          </Button>
          <Button
            variant={loginMethod === "face" ? "contained" : "outlined"}
            onClick={() => handleLoginMethodChange("face")}
            sx={{
              fontWeight: "bold",
              backgroundColor: loginMethod === "face" ? "#ff6f61" : "transparent",
              color: loginMethod === "face" ? "#fff" : "#ff6f61",
              borderColor: "#ff6f61",
              "&:hover": {
                backgroundColor: loginMethod === "face" ? "#e55d50" : "#ff6f61",
                color: "#fff",
              },
              width: "50%",
            }}
          >
            Face ID
          </Button>
        </Box>

        <Box
          sx={{
            width: "100%",
            padding: 3,
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loginMethod === "email" ? (
            <>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                sx={{ mb: 1 }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  justifyContent: "flex-start",
                }}
              >
                <Checkbox
                  checked={showPassword}
                  onChange={toggleShowPassword}
                  sx={{ color: "#6a11cb" }}
                />
                <Typography variant="body2" sx={{ color: "#6a11cb" }}>
                  Show Password
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Use your camera for Face ID verification.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenCamera}
                sx={{
                  py: 1,
                  px: 3,
                  fontWeight: "bold",
                  backgroundColor: "#ff6f61",
                  "&:hover": { backgroundColor: "#e55d50" },
                }}
              >
                Open Camera
              </Button>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "#6a11cb",
              "&:hover": { backgroundColor: "#4a0f9c" },
            }}
          >
            Submit
          </Button>
        </Box>

        {role === "admin" && (
          <Link to="/signup">
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
              alert("Redirect to Signup Page");
            }}
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
