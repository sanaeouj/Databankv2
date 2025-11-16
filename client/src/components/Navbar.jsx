import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../assets/logo.svg";

const Navbar = ({ showNavLinks = true, showSignUp = true }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        py: 1.5,
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <img src={LogoIcon} alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "20px",
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.5px",
              }}
            >
              Data Warehouse
            </Typography>
          </Box>

          {showNavLinks && (
            <Box display="flex" gap={3}>
              {["Plateforme", "Rôles", "Ressources", "Tarifs"].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      color: "#8B5CF6",
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                textTransform: "none",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": { 
                  color: "#8B5CF6",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                },
              }}
            >
              Demander une démo
            </Button>

            {showSignUp && (
              <Button
                onClick={() => navigate("/login")}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  borderWidth: 2,
                  fontWeight: 600,
                  px: 3,
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                    borderColor: "#8B5CF6",
                    color: "#8B5CF6",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                  },
                }}
              >
                Se connecter
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
