import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Fade,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      const nameParts = storedEmail.split("@")[0].split(".");
      const formattedName = nameParts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      setUserName(formattedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#0f172a",
        color: "white",
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
        gap: 0,
        m: 0,
        p: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
              background: "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
          zIndex: 0,
        },
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          m: 0,
          p: 0,
        }}
      >
        <AppBar
          position="static"
          sx={{ 
            bgcolor: "rgba(15, 23, 42, 0.8)", 
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Toolbar sx={{ px: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                background: "linear-gradient(135deg, #fff 0%, #bfc9db 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Tableau de bord
            </Typography>
            <Typography sx={{ mr: 3, color: "#8CA0B3" }}>
              Bienvenue, {userName}
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                color: "white",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #818cf8 0%, #6366F1 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                },
              }}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 6, px: 4, flexGrow: 1 }}>
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                p: 5,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: "linear-gradient(135deg, #fff 0%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Bienvenue, {userName} 👋
              </Typography>
              <Typography variant="body1" sx={{ color: "#8CA0B3", lineHeight: 1.8 }}>
                Commencez à explorer votre tableau de bord et découvrez toutes les fonctionnalités disponibles pour gérer vos contacts et entreprises.
              </Typography>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
