import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
const services = [
  "gérer vos données",
  "automatiser vos processus",
  "optimiser votre workflow",
  "analyser vos performances",
  "découvrir des insights",
];

const Hero = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const navigate = useNavigate();
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % services.length;
      const fullText = services[i];

      setText((prevText) =>
        isDeleting
          ? fullText.substring(0, prevText.length - 1)
          : fullText.substring(0, prevText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        py: 10,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      <Container 
        maxWidth="lg"
        sx={{ 
          position: "relative", 
          zIndex: 2,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            px: 2,
            py: 0.5,
            mb: 3,
            background: "rgba(139, 92, 246, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              letterSpacing: 3,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ✨ Plateforme de gestion de données
          </Typography>
        </Box>

        <Typography 
          variant="h1" 
          sx={{ 
            my: 3, 
            fontWeight: 900,
            fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem", lg: "5rem" },
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #8B5CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 80px rgba(139, 92, 246, 0.3)",
          }}
        >
          La solution complète
          <br />
          pour{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "inherit",
              fontWeight: "inherit",
              borderRight: "4px solid #8B5CF6",
              whiteSpace: "nowrap",
              pr: 1,
              animation: "blink-caret 0.75s step-end infinite",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "4px",
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
              },
            }}
          >
            {text || "commencer"}
          </Box>
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2,
            mb: 4,
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: { xs: "1rem", md: "1.25rem" },
            lineHeight: 1.7,
            maxWidth: "600px",
            fontWeight: 400,
          }}
        >
          Transformez vos données en opportunités avec notre plateforme intelligente. 
          Gérez, analysez et optimisez vos processus en toute simplicité.
        </Typography>

        <Box 
          sx={{ 
            mt: 5, 
            display: "flex", 
            gap: 3, 
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/SignUp")}
            sx={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              px: 5,
              py: 2,
              borderRadius: 3,
              fontSize: "1.1rem",
              boxShadow: "0 10px 40px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                transition: "left 0.5s",
              },
              "&:hover": { 
                background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
                transform: "translateY(-4px) scale(1.02)",
                boxShadow: "0 20px 60px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)",
                "&::before": {
                  left: "100%",
                },
              },
              "&:active": {
                transform: "translateY(-2px) scale(0.98)",
              },
            }}
          >
            🚀 Commencer gratuitement
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              borderWidth: 2,
              color: "#fff",
              textTransform: "none",
              px: 5,
              py: 2,
              borderRadius: 3,
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                opacity: 0,
                transition: "opacity 0.3s",
              },
              "&:hover": { 
                borderColor: "#8B5CF6", 
                color: "#8B5CF6",
                background: "rgba(139, 92, 246, 0.15)",
                transform: "translateY(-4px) scale(1.02)",
                boxShadow: "0 15px 40px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)",
                "&::before": {
                  opacity: 1,
                },
              },
              "&:active": {
                transform: "translateY(-2px) scale(0.98)",
              },
            }}
          >
            📞 Demander une démo
          </Button>
        </Box>

        {/* Stats ou features en bas */}
        <Box 
          sx={{ 
            mt: 8,
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {[
            { label: "Données gérées", value: "10M+" },
            { label: "Utilisateurs actifs", value: "50K+" },
            { label: "Uptime", value: "99.9%" },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
                px: 3,
                py: 2,
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.1)",
                  borderColor: "rgba(139, 92, 246, 0.3)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <style>
        {`
          @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #8B5CF6; }
          }
        `}
      </style>
    </Box>
  );
};

export default Hero;
