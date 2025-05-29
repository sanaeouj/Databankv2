import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import Sidebar from "../components/Sidebar";
import FilterSidebar from "../components/FilterSidebar";
import ResultsTable from "../components/ResultsTable";
import { useLocation } from "react-router-dom";

const drawerWidth = 250;

const People = () => {
  const location = useLocation();
  const initialFilter = location.state?.filter || {};
  const [filters, setFilters] = useState(initialFilter);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(Object.keys(initialFilter).length > 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://databank-yndl.onrender.com/api/ressources/all"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Appliquer les filtres
  const applyFilters = (data) => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        let itemValue = key.includes(".")
          ? key.split(".").reduce((acc, part) => acc?.[part], item)
          : item[key];
        if (itemValue === undefined || itemValue === null) return false;
        if (typeof itemValue === "object" && itemValue !== null) {
          itemValue = Object.values(itemValue).join(" ");
        }
        const normalizedValueToMatch = String(itemValue).toLowerCase().trim();
        const normalizedFilterValue = value.toLowerCase().trim();
        return normalizedValueToMatch.includes(normalizedFilterValue);
      });
    });
  };

  const filteredData = applyFilters(data);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", bgcolor: "#181F2A" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          width: `calc(100vw - ${drawerWidth}px)`,
          minHeight: "100vh",
          bgcolor: "#181F2A",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* Sidebar des filtres, collée sans espace */}
        <Box
          sx={{
            width: 250,
            minWidth: 250,
            maxWidth: 250,
            height: "100vh",
            bgcolor: "#20293A",
            borderRight: "1px solid #232B3B",
            p: 0,
            m: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {loading ? (
            <Paper sx={{ bgcolor: "#20293A", p: 2, boxShadow: "none" }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Chargement des filtres...
              </Typography>
            </Paper>
          ) : (
            <FilterSidebar
              filters={filters}
              setFilters={(newFilters) => {
                setFilters(newFilters);
                setShowTable(true);
              }}
              data={data}
            />
          )}
        </Box>
        {/* Contenu principal */}
        <Box
          sx={{
            flexGrow: 1,
            p: 0,
            height: "100vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#181F2A",
          }}
        >
          <Box sx={{ px: 4, pt: 4, pb: 2 }}>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 0 }}>
              People List
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, px: 4, pb: 4, display: "flex", flexDirection: "column" }}>
            <Paper sx={{ bgcolor: "#20293A", p: 0, borderRadius: 3, minHeight: 400, boxShadow: "none", flexGrow: 1, display: "flex", flexDirection: "column" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                  <CircularProgress />
                </Box>
              ) : showTable && filteredData.length > 0 ? (
                <ResultsTable data={filteredData} filters={filters} />
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ color: "gray" }}>
                    Veuillez sélectionner un filtre pour afficher le tableau.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default People;