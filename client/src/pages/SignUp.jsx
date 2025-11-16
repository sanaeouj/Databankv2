import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Stack,
  Alert,
  Autocomplete,
  IconButton,
  InputAdornment,
  Fade,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import GoogleIcon from "../assets/google-logo.png";

import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

import { auth, googleProvider } from "../firebase/firebaseAuth";

import Navbar from "../components/Navbar";

const emailOptions = ["test@example.com"];

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Failed to sign in with Google.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Auth Error:", error);
      setError("Failed to create an account.");
    }
  };

  return (
    <>
      <Navbar showNavLinks={false} showSignIn={false} />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
          color: "#1e1e1e",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          position: "relative",
          overflowX: "hidden",
          overflowY: "auto",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
            animation: "pulse 10s ease-in-out infinite",
          },
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
            "50%": { transform: "scale(1.1)", opacity: 0.8 },
          },
        }}
      >
        <Fade in timeout={800}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
              py: 3,
              px: { xs: 2, sm: 4 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                maxWidth: 500,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700, 
                  mb: 1, 
                  fontSize: "1.5rem",
                  background: "linear-gradient(135deg, #1e1e1e 0%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Créer un compte
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, color: "#64748b", lineHeight: 1.6, fontSize: "0.875rem" }}>
                Moteur de vente alimenté par l'IA pour atteindre et convertir vos acheteurs idéaux à partir d'une base de données de plus de 210 millions de contacts.
              </Typography>

              <Box component="form" onSubmit={handleAuth}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      size="small"
                      sx={{
                        color: "#8B5CF6",
                        "&.Mui-checked": {
                          color: "#8B5CF6",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                      En vous inscrivant, vous acceptez les{" "}
                      <a href="#" style={{ color: "#8B5CF6", textDecoration: "none" }}>
                        Conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="#" style={{ color: "#8B5CF6", textDecoration: "none" }}>
                        Politique de confidentialité
                      </a>
                      .
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2, fontSize: "0.875rem" }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 1.5, borderRadius: 2, fontSize: "0.875rem" }}>
                    {success}
                  </Alert>
                )}

                <Stack spacing={2}>
                  <Autocomplete
                    freeSolo
                    options={emailOptions}
                    onInputChange={(event, newValue) => setEmail(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Email"
                        variant="outlined"
                        value={email}
                        autoComplete="off"
                        InputLabelProps={{ style: { color: "#64748b" } }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                            "&:hover fieldset": { borderColor: "#8B5CF6" },
                            "&.Mui-focused fieldset": { borderColor: "#8B5CF6", borderWidth: 2 },
                          },
                        }}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    label="Mot de passe"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="off"
                    InputLabelProps={{ style: { color: "#64748b" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "#64748b" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                        "&:hover fieldset": { borderColor: "#6366F1" },
                        "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: 2 },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirmer le mot de passe"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="off"
                    InputLabelProps={{ style: { color: "#64748b" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "#64748b" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                        "&:hover fieldset": { borderColor: "#6366F1" },
                        "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: 2 },
                      },
                    }}
                  />

                  <Divider sx={{ "&::before, &::after": { borderColor: "rgba(0,0,0,0.1)" } }}>
                    ou
                  </Divider>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleSignIn}
                    startIcon={
                      <img src={GoogleIcon} alt="Google" style={{ width: 20 }} />
                    }
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      color: "#1e1e1e",
                      borderColor: "rgba(0,0,0,0.2)",
                      py: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#8B5CF6",
                        color: "#8B5CF6",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                      },
                    }}
                  >
                    S'inscrire avec Google
                  </Button>

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
                    Créer un compte
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Fade>

        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80)",
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
      </Box>
    </>
  );
};

export default SignUp;
