import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, TextField, Button } from "@mui/material";
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

  // Ajout pour la sauvegarde des filtres
  const [savedFilters, setSavedFilters] = useState(() => {
    const stored = localStorage.getItem("savedFilters");
    return stored ? JSON.parse(stored) : {};
  });
  const [filterName, setFilterName] = useState("");

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

  // Fonction pour sauvegarder le filtre
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    const updated = { ...savedFilters, [filterName]: filters };
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
    setFilterName("");
  };

  const filteredData = applyFilters(data);

  return (
    <Box sx={{ display: "flex", width: "90vw", height: "100vh", bgcolor: "#181F2A", m: 0, p: 0 }}>
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
          m: 0,  
          p: 0, 
        }}
      >
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
            {/* Champ nom du filtre + bouton Save */}
            <Box sx={{ display: "flex", gap: 1, mt: 2, mb: 2 }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Enter filter name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                sx={{
                  bgcolor: "#20293A",
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#293145" },
                  width: 180,
                }}
              />
              <Button
                variant="contained"
                onClick={handleSaveFilter}
                sx={{
                  bgcolor: "#6366F1",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  px: 2,
                  "&:hover": { bgcolor: "#4ADE80", color: "#181F2A" },
                }}
              >
                Save
              </Button>
            </Box>
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