// src/layouts/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  
  return (
    <div style={{ 
      display: "flex", 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0, 
      gap: 0,
      backgroundColor: "#0F172A"
    }}>
      <Sidebar />
      <div style={{ 
        flexGrow: 1, 
        width: "calc(100vw - 250px)", 
        minHeight: "100vh", 
        overflowY: "auto",
        backgroundColor: "#0F172A"
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
