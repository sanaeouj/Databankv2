import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Building2, List, UserPlus, Search } from "lucide-react";
import LogoIcon from "../assets/logo.svg";
import styles from "./Sidebar.module.css";

const drawerWidth = 250;

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  // Récupérer les infos utilisateur depuis le localStorage
  const storedEmail = localStorage.getItem("userEmail") || "user@example.com";
  const nameParts = storedEmail.split("@")[0].split(".");
  const formattedName = nameParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const user = {
    name: formattedName,
    email: storedEmail,
  };

  const sections = [
    {
      title: "PROSPECT & ENRICH",
      items: [
        { text: "Home", icon: <Home size={20} />, to: "/Home" },
        { text: "People", icon: <Users size={20} />, to: "/People" },
        { text: "Add People", icon: <UserPlus size={20} />, to: "/addpeople" },
        { text: "Companies", icon: <Building2 size={20} />, to: "/companies" },
        { text: "Lists", icon: <List size={20} />, to: "/lists" },
      ],
    },
  ];

  return (
    <div className={styles.sidebar} style={{ width: drawerWidth }}>
      <div className={styles.sidebarContent}>
        {/* Logo et titre */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img src={LogoIcon} alt="Logo" className={styles.logo} />
          </div>
          <h6 className={styles.title}>Data Warehouse</h6>
        </div>

        {/* Barre de recherche */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Sections */}
        <div className={styles.navSection}>
          {sections.map((section) => (
            <div key={section.title}>
              <p className={styles.sectionTitle}>{section.title}</p>
              <ul className={styles.navList}>
                {section.items.map(({ text, icon, to }) => {
                  const isActive = location.pathname === to || 
                    (to === "/Home" && location.pathname === "/home");
                  return (
                    <li key={text}>
                      <NavLink
                        to={to}
                        className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                      >
                        <span className={styles.navIcon}>{icon}</span>
                        <span className={styles.navText}>{text}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* User Profile Section */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div
              className={styles.avatar}
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
