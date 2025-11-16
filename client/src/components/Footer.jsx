import React from "react";
import { Box, Typography, Grid, Link, Stack } from "@mui/material";
import LogoIcon from "../assets/logo.svg";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#fff",
        padding: "80px 40px 40px",
        fontFamily: "'Inter', 'Roboto', 'Open Sans', sans-serif",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
        },
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: "50px" }}>
        <img src={LogoIcon} alt="Logo" style={{ width: 80, height: 80 }} />
      </Box>

      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ 
              fontSize: "18px", 
              marginBottom: "20px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Commencer
          </Typography>
          <Stack spacing={1.5}>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Tarifs
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Demander une démo
            </Link>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ 
              fontSize: "18px", 
              marginBottom: "20px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Produit
          </Typography>
          <Stack spacing={1.5}>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Constructeur de pipeline
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Assistant d'appel
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Enrichissement de données
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Plateforme Go-To-Market
            </Link>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ 
              fontSize: "18px", 
              marginBottom: "20px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Ressources
          </Typography>
          <Stack spacing={1.5}>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Académie
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Magazine
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Insights
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Partenaires
            </Link>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ 
              fontSize: "18px", 
              marginBottom: "20px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Entreprise
          </Typography>
          <Stack spacing={1.5}>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Carrières
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Avis clients
            </Link>
            <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
              Nous contacter
            </Link>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Typography
            variant="h6"
            sx={{ 
              fontSize: "18px", 
              marginBottom: "20px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Prospecter partout
          </Typography>
          <Typography variant="body2" sx={{ color: "#8CA0B3", lineHeight: 1.7 }}>
            Obtenez des emails et numéros de téléphone vérifiés et contactez instantanément tout en travaillant dans vos outils préférés.
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          textAlign: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "40px",
          marginTop: "50px",
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: "20px", color: "#8CA0B3" }}>
          © 2025 Data Warehouse. Tous droits réservés.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
            Politique de confidentialité
          </Link>
          <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
            Conditions
          </Link>
          <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
            Ne pas vendre mes informations
          </Link>
          <Link href="#" underline="none" sx={{ color: "#8CA0B3", transition: "color 0.2s", "&:hover": { color: "#8B5CF6" } }}>
            À propos
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
