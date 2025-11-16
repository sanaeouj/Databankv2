import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Fade,
  Paper,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import GoogleIcon from "../assets/google-logo.png";
import {
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase/firebaseAuth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AlertSnackbar = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const navigate = useNavigate();

  const showSnackbar = (message, severity = "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

const handleGoogleLogIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", result.user.displayName || "User");
    navigate("/Home");
  } catch (error) {
    showSnackbar(`Erreur Firestore: ${error.message}`, "error");
  }
};

  const handleEmailPasswordLogIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", userCredential.user.displayName || "User");

      navigate("/Home");
    } catch (error) {
      console.error("Email Log-In Error:", error);
      showSnackbar(
        "Failed to log in. Please check your email and password.",
        "error"
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showSnackbar("Please enter your email to reset your password.", "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showSnackbar("A password reset email has been sent.", "success");
    } catch (error) {
      console.error("Password Reset Error:", error);
      showSnackbar("Failed to send reset email. Please try again.", "error");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden", overflowY: "auto" }}>
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 3,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
              animation: "pulse 8s ease-in-out infinite",
            },
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
              "50%": { transform: "scale(1.1)", opacity: 0.8 },
            },
          }}
        >
          <Fade in timeout={600}>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography 
                variant="h5" 
                color="white" 
                sx={{ 
                  mb: 0.5,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  background: "linear-gradient(135deg, #fff 0%, #bfc9db 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Bienvenue
              </Typography>
              <Typography variant="body2" color="#8CA0B3" sx={{ mb: 2, fontSize: "0.875rem" }}>
                Connectez-vous pour accéder à votre espace
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  maxWidth: 450,
                  background: "rgba(30, 41, 59, 0.6)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 3,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Stack spacing={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleLogIn}
                    startIcon={
                      <img src={GoogleIcon} alt="Google" style={{ width: 20 }} />
                    }
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      py: 1.5,
                      background: "rgba(255, 255, 255, 0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#8B5CF6",
                        color: "#8B5CF6",
                        background: "rgba(139, 92, 246, 0.1)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                      },
                    }}
                  >
                    Se connecter avec Google
                  </Button>

                  <Divider sx={{ color: "rgba(255, 255, 255, 0.3)", "&::before, &::after": { borderColor: "rgba(255, 255, 255, 0.1)" } }}>
                    OU
                  </Divider>

                  <form onSubmit={handleEmailPasswordLogIn}>
                    <Stack spacing={2.5}>
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputLabelProps={{ style: { color: "#8CA0B3" } }}
                        InputProps={{
                          style: {
                            color: "white",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: 2,
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.1)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#8B5CF6",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#8B5CF6",
                              borderWidth: 2,
                            },
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Mot de passe"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputLabelProps={{ style: { color: "#8CA0B3" } }}
                        InputProps={{
                          style: {
                            color: "white",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: 2,
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.1)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#8B5CF6",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#8B5CF6",
                              borderWidth: 2,
                            },
                          },
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#8B5CF6",
                          textAlign: "right",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            color: "#A78BFA",
                            textDecoration: "underline",
                          },
                        }}
                        onClick={handleForgotPassword}
                      >
                        Mot de passe oublié ?
                      </Typography>

                      <FormControlLabel
                        control={
                          <Checkbox
                            defaultChecked
                            sx={{
                              color: "#8CA0B3",
                            "&.Mui-checked": {
                              color: "#8B5CF6",
                            },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: "#8CA0B3", fontSize: "0.9rem" }}>
                            Se souvenir de moi
                          </Typography>
                        }
                      />

                      <Button
                        type="submit"
                        fullWidth
                        sx={{
                          background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                          color: "white",
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: "none",
                          py: 1.5,
                          boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                          },
                        }}
                      >
                        Se connecter
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Paper>
            </Box>
          </Fade>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage: `linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.8) 100%)",
            },
          }}
        />

        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <AlertSnackbar
            onClose={() => setSnackOpen(false)}
            severity={snackSeverity}
          >
            {snackMessage}
          </AlertSnackbar>
        </Snackbar>
      </Box>
    </>
  );
};

export default LogIn;