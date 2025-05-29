import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  InputBase,
  Avatar,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  ListAlt as ListAltIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import Icon from "../assets/Icon.png";

const drawerWidth = 250;

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les infos utilisateur depuis le localStorage
  const storedEmail = localStorage.getItem("userEmail") || "user@example.com";
  const nameParts = storedEmail.split("@")[0].split(".");
  const formattedName = nameParts
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  const user = {
    name: formattedName,
    email: storedEmail,
  };

  const sections = [
    {
      title: "PROSPECT & ENRICH",
      items: [
        { text: "Home", icon: <HomeIcon sx={{ color: "#fff" }} />, to: "/Home" },
        { text: "People", icon: <PeopleIcon sx={{ color: "#fff" }} />, to: "/People" },
        { text: "Add People", icon: <PersonAddIcon sx={{ color: "#fff" }} />, to: "/addpeople" },
        { text: "Companies", icon: <BusinessIcon sx={{ color: "#fff" }} />, to: "/companies" },
        { text: "Lists", icon: <ListAltIcon sx={{ color: "#fff" }} />, to: "/lists" },
      ],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#1B2431",
          color: "#fff",
          borderRight: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box>
        {/* Logo et titre */}
        <Box sx={{ display: "flex", alignItems: "center", p: 2, pb: 1 }}>
          <img src={Icon} alt="Logo" style={{ width: 36, marginRight: 10 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            IntelligentB2B
          </Typography>
        </Box>
        {/* Barre de recherche */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#232E3E",
            borderRadius: 2,
            mx: 2,
            mb: 2,
            height: 40,
            px: 2,
          }}
        >
          <SearchIcon sx={{ color: "#9ca3af", mr: 1 }} />
          <InputBase
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              color: "#fff",
              width: "100%",
              fontSize: 15,
            }}
          />
        </Box>
        <Divider sx={{ borderColor: "#232E3E", mb: 1 }} />
        {/* Sections */}
        <List dense>
          {sections.map((section) => (
            <Box key={section.title}>
              <Typography
                sx={{
                  px: 3,
                  pt: 2,
                  pb: 1,
                  fontSize: 12,
                  color: "#8CA0B3",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                {section.title}
              </Typography>
              {section.items.map(({ text, icon, to }) => (
                <ListItemButton
                  component={NavLink}
                  to={to}
                  key={text}
                  sx={{
                    color: "#bfc9db",
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    "&.active": {
                      backgroundColor: "#60a5fa",
                      color: "#fff",
                      "& .MuiListItemIcon-root": { color: "#fff" },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
            </Box>
          ))}
        </List>
      </Box>
      {/* Utilisateur en bas */}
      <Box sx={{ p: 3, pb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "#4ADE80", color: "#181F2A", mr: 2 }}>
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#fff", fontSize: 16 }}>
              {user.name}
            </Typography>
            <Typography sx={{ color: "#bfc9db", fontSize: 13 }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;