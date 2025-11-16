import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Fade, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          backgroundImage: `url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          position: "relative",
          overflowX: "hidden",
          overflowY: "auto",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%)",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            animation: "float 20s ease-in-out infinite",
            zIndex: 0,
          },
          "@keyframes float": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: 0.5 },
            "50%": { transform: "translate(-10%, -10%) scale(1.1)", opacity: 0.8 },
          },
        }}
      >
        {/* Particules animées en arrière-plan */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                background: "rgba(139, 92, 246, 0.5)",
                borderRadius: "50%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                "@keyframes twinkle": {
                  "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
                  "50%": { opacity: 1, transform: "scale(1.5)" },
                },
              }}
            />
          ))}
        </Box>

        <Fade in timeout={1000}>
          <Box sx={{ position: "relative", zIndex: 1, width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar
              showNavLinks={true}
              showSignUp={true}
              onSignUpClick={handleSignUpClick}
            />

            <Hero onSignUpClick={handleSignUpClick} />
          </Box>
        </Fade>
      </Box>

      <Footer />
    </>
  );
};

export default LandingPage;
