import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "../assets/images/logo.png";
import photo1 from "../assets/images/photo1.png";
import photo2 from "../assets/images/photo2.webp";
import photo3 from "../assets/images/photo3.webp";
import LoginIcon from "@mui/icons-material/Login";

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
  };

  const images = [photo1, photo2, photo3];

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: { xs: 2, md: 4 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "#fff",
        position: "relative",
      }}
    >
      <Link to="/login">
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            top: { xs: 15, md: 30 },
            right: { xs: 15, md: 25 },
            backgroundColor: "#ff6f61",
            color: "#fff",
            px: { xs: 3, md: 5 },
            fontSize: { xs: 14, md: 20 },
            py: 1,
            fontWeight: "bold",
            borderRadius: "30px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease, background-color 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            "&:hover": {
              backgroundColor: "#e55d50",
              transform: "scale(1.1)",
            },
          }}
        >
          Login
          <LoginIcon sx={{ fontSize: { xs: 20, md: 25 }, fontWeight: "bold" }} />
        </Button>
      </Link>

      <Box sx={{ mb: 3 }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "auto",
            maxWidth: "150px",
            borderRadius: "50%",
            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mt: 2,
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          Face Attendance System
        </Typography>
      </Box>

      <Typography
        variant="h6"
        sx={{
          mx: "auto",
          mb: 3,
          textAlign: "justify",
          width: { xs: "90%", md: "80%" },
          fontSize: { xs: "0.9rem", md: "1.2rem" },
        }}
      >
        Welcome to <strong>Attendify!</strong> Simplify attendance management
        with our cutting-edge facial recognition web app. Attendify ensures
        accuracy, eliminates errors, and saves time. Designed for organizations
        of all sizes, our user-friendly and secure platform offers real-time
        tracking and seamless data management to enhance productivity and
        efficiency.
      </Typography>
      <Box
        sx={{
          width: { xs: "100%", md: "60%" },
          margin: "auto",
          mt: 7,
          mb: 4,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          overflow: "hidden",
          height: { xs: "300px", md: "500px" },
        }}
      >
        <Slider {...sliderSettings}>
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default HomePage;
