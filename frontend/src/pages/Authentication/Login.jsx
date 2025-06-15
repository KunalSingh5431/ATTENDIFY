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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  HowToReg as RoleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ role: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [openPasscodeDialog, setOpenPasscodeDialog] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState("");
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

  // Admin signup click handler
  const handleAdminSignUpClick = (e) => {
    e.preventDefault();
    setOpenPasscodeDialog(true);
  };

  // Passcode verification
  const handleVerifyPasscode = () => {
    const decodedPasscode = "admin123"; 

    if (enteredPasscode === decodedPasscode) {
      setOpenPasscodeDialog(false);
      navigate("/signup");
    } else {
      toast.error("Incorrect passcode. Access denied.");
      setEnteredPasscode("");
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
              sx={{
                marginBottom: 1,
                color: "#6a11cb",
                display: "flex",
                alignItems: "center",
                gap: 1,
                marginLeft: 18,
                fontWeight: "bold",
              }}
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
            <Typography
              variant="body2"
              onClick={handleAdminSignUpClick}
              sx={{
                marginTop: 2,
                fontWeight: 700,
                color: "#6a11cb",
                fontSize: "15px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Don't have an account? Sign Up
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog
      open={openPasscodeDialog}
      onClose={() => setOpenPasscodeDialog(false)}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingY: 1.5,
          paddingX: 2,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <LockIcon sx={{ fontSize: 24 }} />
          Enter Admin Passcode
        </Box>
        <IconButton
          aria-label="close"
          onClick={() => setOpenPasscodeDialog(false)}
          sx={{
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 3, mt:3 }}>
        <TextField
          label="Passcode"
          type="password"
          variant="outlined"
          fullWidth
          value={enteredPasscode}
          onChange={(e) => setEnteredPasscode(e.target.value)}
          sx={{
            marginTop: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions sx={{ paddingX: 3, paddingBottom: 2 }}>
        <Button
          onClick={handleVerifyPasscode}
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "#fff",
            fontWeight: "bold",
            paddingY: 1.2,
            borderRadius: 2,
            "&:hover": {
              background: "linear-gradient(to right, #4a0f9c, #1a4fbd)",
            },
          }}
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default LoginPage;
